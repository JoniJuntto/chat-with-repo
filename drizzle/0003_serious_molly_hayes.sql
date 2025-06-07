
DO $$ 
BEGIN
    -- Drop all foreign key constraints
    ALTER TABLE "chats" DROP CONSTRAINT IF EXISTS "chats_user_id_users_id_fk";
    ALTER TABLE "favorite_repos" DROP CONSTRAINT IF EXISTS "favorite_repos_userId_users_id_fk";
    ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_userId_users_id_fk";
    ALTER TABLE "rate_limit" DROP CONSTRAINT IF EXISTS "rate_limit_userId_users_id_fk";
END $$;

-- Change column types
ALTER TABLE "users" ALTER COLUMN "id" TYPE text USING id::text;
ALTER TABLE "chats" ALTER COLUMN "user_id" TYPE text USING user_id::text;
ALTER TABLE "favorite_repos" ALTER COLUMN "userId" TYPE text USING "userId"::text;
ALTER TABLE "subscription" ALTER COLUMN "userId" TYPE text USING "userId"::text;
ALTER TABLE "rate_limit" ALTER COLUMN "userId" TYPE text USING "userId"::text;