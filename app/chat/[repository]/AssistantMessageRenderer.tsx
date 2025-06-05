import { Message } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

export const AssistantMessageRenderer = ({ message }: { message: Message }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="relative group">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(String(children));
                    }}
                    className="text-xs px-2 py-1 rounded bg-muted/50 hover:bg-muted text-muted-foreground"
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  // @ts-expect-error Known type mismatch with react-syntax-highlighter
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                  className="!mt-2 !mb-3 !rounded-md !bg-muted/50"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.375rem",
                    background: "transparent",
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-muted-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2 text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-muted-foreground leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-3">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-muted/50 font-semibold text-left text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-muted-foreground">
              {children}
            </td>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};
