import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { chatsTable, messagesTable, repositoriesTable } from "@/app/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return NextResponse.json([]);
    }

    const chats = await db
      .select({
        id: chatsTable.id,
        repository: repositoriesTable.url,
        createdAt: chatsTable.createdAt,
      })
      .from(chatsTable)
      .innerJoin(
        repositoriesTable,
        eq(chatsTable.repositoryId, repositoriesTable.id)
      )
      .where(eq(chatsTable.userId, session.user.id))
      .orderBy(desc(chatsTable.createdAt))
      .limit(10);

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { repository, messages } = (await req.json()) as {
      repository: string;
      messages: { role: string; content: string }[];
    };
    if (!repository || !messages?.length) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const [owner, name] = repository.split("/");

    // upsert repository
    const [repo] = await db
      .insert(repositoriesTable)
      .values({ url: `https://github.com/${repository}`, owner, name })
      .onConflictDoNothing()
      .returning();

    const repoId =
      repo?.id ||
      (await db
        .select({ id: repositoriesTable.id })
        .from(repositoriesTable)
        .where(eq(repositoriesTable.url, `https://github.com/${repository}`))
        .then((r) => r[0].id));

    const [chat] = await db
      .insert(chatsTable)
      .values({
        userId: session.user.id,
        repositoryId: repoId,
        title: messages[0].content.slice(0, 50),
      })
      .returning();

    await db.insert(messagesTable).values(
      messages.map((m) => ({ chatId: chat.id, role: m.role, content: m.content }))
    );

    return NextResponse.json({ id: chat.id });
  } catch (error) {
    console.error("Error saving chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
