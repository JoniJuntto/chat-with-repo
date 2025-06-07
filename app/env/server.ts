import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnvs = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    OPENAI_API_KEY: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    GITHUB_TOKEN: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
    DATABASE_URL: z.string(),
    AUTH_SECRET: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type ServerEnvs = typeof serverEnvs;
