import {
  integer,
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  boolean,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ mode: "string" }).defaultNow(),
  updatedAt: timestamp({ mode: "string" }).defaultNow(),
};

export const rateLimitTable = pgTable("rate_limit", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  messageCount: integer().notNull().default(0),
  lastReset: timestamp({ mode: "string" }).defaultNow(),
  ...timestamps,
});

export const subscriptionTable = pgTable("subscription", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  isActive: boolean().notNull().default(false),
  stripeCustomerId: varchar({ length: 255 }).unique(),
  stripeSubscriptionId: varchar({ length: 255 }).unique(),
  ...timestamps,
});

export const favoriteReposTable = pgTable("favorite_repos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  repoUrl: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  owner: varchar({ length: 255 }).notNull(),
  ...timestamps,
});
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar({ length: 255 }).unique(),
  ipAddress: varchar({ length: 255 }),
  rateLimit: integer().notNull().default(0),
  lastReset: timestamp({ mode: "string" }).defaultNow(),
  ...timestamps,
});

export const aiModelsTable = pgTable("ai_models", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  provider: varchar("provider", { length: 100 }).notNull(),
  version: varchar("version", { length: 50 }),
  description: text("description"),
  maxTokens: integer("max_tokens"),
  isActive: boolean("is_active").default(true).notNull(),
  costPerTokenInputInCentsPerMillion: integer(
    "cost_per_token_input_in_cents_per_million"
  ),
  costPerTokenOutputInCentsPerMillion: integer(
    "cost_per_token_output_in_cents_per_million"
  ),
  ...timestamps,
});

export const repositoriesTable = pgTable("repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url", { length: 255 }).notNull().unique(),
  owner: varchar("owner", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  language: varchar("language", { length: 100 }),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  lastFetchedAt: timestamp({ mode: "string" }).defaultNow(),
  ...timestamps,
});

export const chatsTable = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  modelId: uuid("model_id").references(() => aiModelsTable.id),
  repositoryId: uuid("repository_id")
    .notNull()
    .references(() => repositoriesTable.id),
  ...timestamps,
});

export const messagesTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsTable.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull(),
  content: text("content").notNull(),
  ...timestamps,
});
