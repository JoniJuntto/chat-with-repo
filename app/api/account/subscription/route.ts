import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { subscriptionTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [subscription] = await db
    .select({
      isActive: subscriptionTable.isActive,
      stripeCustomerId: subscriptionTable.stripeCustomerId,
    })
    .from(subscriptionTable)
    .where(eq(subscriptionTable.userId, session.user.id));

  return NextResponse.json({ subscription });
}
