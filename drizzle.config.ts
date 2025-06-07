import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { serverEnvs } from "@/app/env/server";

const url = serverEnvs.DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
