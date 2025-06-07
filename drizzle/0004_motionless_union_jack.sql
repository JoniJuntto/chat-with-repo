CREATE OR REPLACE FUNCTION migrate_user_id_to_text()
RETURNS void AS $$
BEGIN
    -- First drop all foreign key constraints
    ALTER TABLE "chats" DROP CONSTRAINT IF EXISTS "chats_user_id_users_id_fk";
    ALTER TABLE "favorite_repos" DROP CONSTRAINT IF EXISTS "favorite_repos_userId_users_id_fk";
    ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_userId_users_id_fk";
    ALTER TABLE "rate_limit" DROP CONSTRAINT IF EXISTS "rate_limit_userId_users_id_fk";

    -- Then change the column types with explicit casting
    ALTER TABLE "users" ALTER COLUMN "id" TYPE text USING id::text;
    ALTER TABLE "chats" ALTER COLUMN "user_id" TYPE text USING user_id::text;
    ALTER TABLE "favorite_repos" ALTER COLUMN "userId" TYPE text USING "userId"::text;
    ALTER TABLE "subscription" ALTER COLUMN "userId" TYPE text USING "userId"::text;
    ALTER TABLE "rate_limit" ALTER COLUMN "userId" TYPE text USING "userId"::text;

    -- Finally recreate the foreign key constraints
    ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    ALTER TABLE "favorite_repos" ADD CONSTRAINT "favorite_repos_userId_users_id_fk" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_users_id_fk" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    ALTER TABLE "rate_limit" ADD CONSTRAINT "rate_limit_userId_users_id_fk" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT migrate_user_id_to_text();

-- Clean up
DROP FUNCTION migrate_user_id_to_text();