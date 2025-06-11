import { db } from "@/app/db";
import { repositoriesTable } from "@/app/db/schema";

export async function upsertRepository(data: {
  url: string;
  owner: string;
  name: string;
  description?: string | null;
  language?: string | null;
  stars?: number;
  forks?: number;
}) {
  const [repo] = await db
    .insert(repositoriesTable)
    .values({
      url: data.url,
      owner: data.owner,
      name: data.name,
      description: data.description ?? null,
      language: data.language ?? null,
      stars: data.stars ?? 0,
      forks: data.forks ?? 0,
    })
    .onConflictDoUpdate({
      target: [repositoriesTable.url],
      set: {
        description: data.description ?? null,
        language: data.language ?? null,
        stars: data.stars ?? 0,
        forks: data.forks ?? 0,
        updatedAt: new Date().toISOString(),
      },
    })
    .returning();
  return repo;
}
