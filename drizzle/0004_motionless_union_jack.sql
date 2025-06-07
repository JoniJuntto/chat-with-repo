ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_users_id_fk" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "favorite_repos" ADD CONSTRAINT "favorite_repos_userId_users_id_fk" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_users_id_fk" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "rate_limit" ADD CONSTRAINT "rate_limit_userId_users_id_fk" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;