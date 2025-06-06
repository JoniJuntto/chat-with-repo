"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/app/lib/db";

interface ChatMessage {
  id: string;
  message: string;
  role: string;
  repoUrl: string | null;
  createdAt: string;
}

interface ChatHistoryProps {
  userId: string;
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch chat history");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [userId]);

  if (loading) {
    return <div>Ladataan keskusteluhistoriaa...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keskusteluhistoria</CardTitle>
        <CardDescription>Näet tässä viimeisimmät keskustelusi</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Ei vielä keskusteluhistoriaa
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-muted ml-auto max-w-[80%]"
                      : "bg-primary/10 mr-auto max-w-[80%]"
                  }`}
                >
                  <div className="text-sm">{message.message}</div>
                  {message.repoUrl && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Repositorio: {message.repoUrl}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString("fi-FI")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
