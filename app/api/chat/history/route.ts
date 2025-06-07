import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { chatsTable } from "@/app/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    // Verify that the requesting user is accessing their own history
    if (userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const messages = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId))
      .orderBy(desc(chatsTable.createdAt))
      .limit(50);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
