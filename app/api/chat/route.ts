import { google } from "@ai-sdk/google";
import { streamText, type Message } from "ai";
import { Octokit } from "@octokit/rest";
import { checkRateLimit } from "@/app/lib/rate-limit";

const octokit = new Octokit();

async function getRepositoryContent(owner: string, repo: string) {
  try {
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    if (!repoData) {
      throw new Error("Repository not found");
    }

    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: "true",
    });

    const importantFiles = tree.tree.filter(
      (item) =>
        item.type === "blob" &&
        (item.path?.endsWith(".md") ||
          item.path?.endsWith(".js") ||
          item.path?.endsWith(".ts") ||
          item.path?.endsWith(".tsx") ||
          item.path?.endsWith(".jsx") ||
          item.path?.endsWith(".py") ||
          item.path?.endsWith(".json") ||
          item.path === "package.json" ||
          item.path === "README.md")
    );

    const fileContents = await Promise.all(
      importantFiles.slice(0, 15).map(async (file) => {
        try {
          const { data: content } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path!,
          });

          if ("content" in content) {
            const decodedContent = Buffer.from(
              content.content,
              "base64"
            ).toString("utf-8");
            return {
              path: file.path,
              content: decodedContent,
            };
          }
        } catch (error) {
          console.error(`Error fetching ${file.path}:`, error);
        }
        return null;
      })
    );

    return {
      repository: {
        name: repoData.name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        url: repoData.html_url,
      },
      files: fileContents.filter(Boolean),
    };
  } catch (error) {
    console.error("Error fetching repository:", error);
    throw new Error("Failed to fetch repository content");
  }
}

function formatMessagesForGemini(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(req: Request) {
  try {
    const rateLimit = await checkRateLimit(req);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: rateLimit.isAuthenticated
            ? "Rate limit exceeded. You can subscribe to unlock more messages."
            : "Please sign in to continue chatting. Unauthenticated users are limited to 1 message.",
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
          isAuthenticated: rateLimit.isAuthenticated,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { messages, repository } = await req.json();

    if (!repository) {
      return new Response("Repository information is required", {
        status: 400,
      });
    }

    const [owner, repo] = repository.split("/");
    const repoContent = await getRepositoryContent(owner, repo);

    const systemPrompt = `You are an AI assistant that helps users understand and work with GitHub repositories. 

- Answer user's question about the repository. Be concise but informative.

Repository Information:
- Name: ${repoContent.repository.name}
- Description: ${repoContent.repository.description || "No description"}
- Primary Language: ${repoContent.repository.language || "Not specified"}
- Stars: ${repoContent.repository.stars}
- Forks: ${repoContent.repository.forks}
- URL: ${repoContent.repository.url}

Repository Files:
${repoContent.files
  .map((file) => `File: ${file?.path}\n${file?.content}\n---`)
  .join("\n")}

IMPORTANT FORMATTING INSTRUCTIONS:
- Use proper markdown formatting in your responses
- Use headers (##, ###) to organize sections
- Use bullet points (-) or numbered lists (1.) for lists
- Use **bold** for important terms and concepts
- Use \`code\` for inline code references
- Use code blocks with language specification for code examples:
  \`\`\`javascript
  // code here
  \`\`\`
- Use > for important notes or quotes
- Structure your responses clearly with proper spacing
- When explaining code, break it down into logical sections
- Use tables when comparing features or listing information systematically

Please help the user understand this repository, its structure, functionality, and answer any questions they have about the code. Be concise but informative.`;

    const formattedMessages = formatMessagesForGemini(messages);

    if (formattedMessages.length > 0) {
      formattedMessages[0].content =
        systemPrompt + "\n\nUser question: " + formattedMessages[0].content;
    }

    const result = streamText({
      model: google("gemini-2.5-flash-preview-05-20"),
      messages: formattedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
