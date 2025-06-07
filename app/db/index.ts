import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnvs } from "@/app/env/server";
import * as schema from "@/app/db/schema";

const db = drizzle(
  postgres(serverEnvs.DATABASE_URL, {
    prepare: true,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  {
    schema,
  }
);

export { db };
