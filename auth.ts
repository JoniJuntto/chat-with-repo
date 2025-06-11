import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: "repo" } }, // Request 'repo' scope
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Store the access token
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error - accessToken is not typed in the session object
      session.accessToken = token.accessToken as string; // Expose it in the session
      return session;
    },
  },
});