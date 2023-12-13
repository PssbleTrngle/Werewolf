import Providers from "@/lib/providers";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Tooltip } from "ui";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <Component {...pageProps} />
        <Tooltip />
      </Providers>
    </SessionProvider>
  );
}

export default appWithTranslation(App);
