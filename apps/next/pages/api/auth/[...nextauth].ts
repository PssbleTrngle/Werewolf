import { notNull } from "@/lib/util";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

function optionalProvider<T>(
  key: string,
  supplier: (options: OAuthUserConfig<T>) => OAuthConfig<T>
) {
  const clientId = process.env[`${key}_CLIENT_ID`];
  const clientSecret = process.env[`${key}_CLIENT_SECRET`];
  if (clientId && clientSecret) {
    return supplier({ clientId, clientSecret });
  } else {
    return null;
  }
}

const providers = [
  optionalProvider<DiscordProfile>("DISCORD", DiscordProvider),
  optionalProvider<GithubProfile>("GITHUB", GithubProvider),
].filter(notNull);

if (providers.length === 0) {
  throw new Error("No authentication providers defined");
}

export const authOptions: AuthOptions = {
  providers,
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
