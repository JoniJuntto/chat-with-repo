"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Send, Github, MessageCircle, User, Bot } from "lucide-react";
import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter, type SyntaxHighlighterProps } from "react-syntax-highlighter";
import { tomorrow as tomorrowStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatInterface() {
  const [repository, setRepository] = useState("");
  const [isRepositorySet, setIsRepositorySet] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        repository,
      },
    });

  const handleRepositorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repository.trim()) {
      setIsRepositorySet(true);
    }
  };

  const resetRepository = () => {
    setRepository("");
    setIsRepositorySet(false);
  };

  if (!isRepositorySet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Github className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Chat with Repository
            </h1>
            <p className="text-gray-600">
              Enter a GitHub repository to start chatting
            </p>
          </div>

          <form onSubmit={handleRepositorySubmit} className="space-y-4">
            <div>
              <label
                htmlFor="repository"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Repository (owner/repo) for example: JoniJuntto/HuikkaBOT
              </label>
              <input
                type="text"
                id="repository"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                placeholder="e.g., facebook/react"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Github className="h-6 w-6 text-indigo-600" />
            <div>
              <h1 className="font-semibold text-gray-900">
                Chat with Repository
              </h1>
              <p className="text-sm text-gray-600">{repository}</p>
            </div>
          </div>
          <button
            onClick={resetRepository}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Change Repository
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to explore {repository}
              </h3>
              <p className="text-gray-600">
                Ask me anything about this repository!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "flex items-start space-x-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div
                className={clsx(
                  "max-w-3xl px-4 py-3 rounded-2xl",
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                )}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              style={tomorrowStyle as SyntaxHighlighterProps['style']}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-3 text-gray-900">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mb-2 text-gray-800">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-md font-medium mb-2 text-gray-700">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 text-gray-700 leading-relaxed">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-700">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-600 mb-3">
                            {children}
                          </blockquote>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">
                            {children}
                          </strong>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto mb-3">
                            <table className="min-w-full border border-gray-300">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-gray-300 px-3 py-2">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about the repository..."
              className="flex-1 px-4 py-3 border text-black placeholder:text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}