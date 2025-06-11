import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getModelAnalytics, ensureDefaultModels } from "@/app/lib/models";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await ensureDefaultModels();
  const analytics = await getModelAnalytics();
  return NextResponse.json(analytics);
}
