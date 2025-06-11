import { db } from "@/app/db";
import { aiModelsTable, chatsTable } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";

export async function ensureDefaultModels() {
  const models = [
    {
      name: "gemini",
      provider: "google",
      version: "2.5-flash-preview-05-20",
      description: "Google Gemini 2.5 Flash",
    },
    {
      name: "gpt-4o",
      provider: "openai",
      version: "gpt-4o",
      description: "OpenAI GPT-4o",
    },
  ];

  for (const model of models) {
    await db
      .insert(aiModelsTable)
      .values(model)
      .onConflictDoNothing({ target: aiModelsTable.name });
  }
}

export async function getModelByName(name: string) {
  const [model] = await db
    .select()
    .from(aiModelsTable)
    .where(eq(aiModelsTable.name, name));
  return model;
}

export async function getModelAnalytics() {
  const models = await db.select().from(aiModelsTable);
  const analytics: { model: string; count: number }[] = [];

  for (const model of models) {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(chatsTable)
      .where(eq(chatsTable.modelId, model.id));
    analytics.push({ model: model.name, count: Number(row?.count ?? 0) });
  }

  return analytics;
}
