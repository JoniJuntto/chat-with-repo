import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { usersTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await db.delete(usersTable).where(eq(usersTable.id, session.user.id));

  return new NextResponse(null, { status: 204 });
}
