import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { usersTable, favoriteReposTable, chatsTable } from "@/app/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [user] = await db
    .select({ email: usersTable.email, createdAt: usersTable.createdAt })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id));

  const [[{ value: favoriteCount }]] = await db
    .select({ value: count() })
    .from(favoriteReposTable)
    .where(eq(favoriteReposTable.userId, session.user.id));

  const [[{ value: chatCount }]] = await db
    .select({ value: count() })
    .from(chatsTable)
    .where(eq(chatsTable.userId, session.user.id));

  return NextResponse.json({ user, favoriteCount, chatCount });
}
