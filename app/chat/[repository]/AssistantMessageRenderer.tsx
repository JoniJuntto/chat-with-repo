import { Message } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AssistantMessageRenderer = ({ message }: { message: Message }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isCopied = copiedCode === codeString;

            return match ? (
              <div className="relative group my-4">
                <div className="absolute right-3 top-3 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCode(codeString)}
                    className={cn(
                      "h-8 px-2 opacity-0 group-hover:opacity-100 transition-all duration-200",
                      "bg-background/80 backdrop-blur-sm border border-border/50",
                      "hover:bg-background/90 hover:border-border",
                      isCopied &&
                        "opacity-100 bg-green-500/10 border-green-500/20"
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-600" />
                        <span className="text-xs text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {match[1]}
                    </span>
                  </div>
                  <SyntaxHighlighter
                    // @ts-expect-error Known type mismatch with react-syntax-highlighter
                    style={codeStyle}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      background: "transparent",
                      padding: "1rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <code
                className={cn(
                  "relative inline-flex items-center gap-1 px-2 py-1 rounded-md",
                  "bg-muted/60 border border-border/30",
                  "text-sm font-mono text-foreground/90",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-md",
                  "before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-50"
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-foreground border-b border-border/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-foreground mt-6 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 text-foreground mt-5 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mb-2 text-foreground mt-4 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-muted-foreground leading-relaxed text-sm">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none mb-4 space-y-2 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground text-sm flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="relative border-l-4 border-primary/40 pl-6 py-2 my-4 bg-muted/20 rounded-r-lg">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20 rounded-full" />
              <div className="italic text-muted-foreground text-sm leading-relaxed">
                {children}
              </div>
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 rounded-lg border border-border/50">
              <table className="min-w-full">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border/30 px-4 py-3 text-left font-semibold text-foreground text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/20 px-4 py-3 text-muted-foreground text-sm">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};
