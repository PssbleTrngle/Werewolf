import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import DiscordProvider from "next-auth/providers/discord";

function requireEnv(key: string) {
  const value = process.env[key];
  if (value) return value;
  throw new Error(`Missing environment variable '${key}'`);
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: requireEnv("DISCORD_CLIENT_ID"),
      clientSecret: requireEnv("DISCORD_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user.email;
    },

    async session({ session, user }) {
      session.user.id = user?.email ?? session.user.email;
      return session;
    },
  },
};

export default NextAuth(authOptions);
