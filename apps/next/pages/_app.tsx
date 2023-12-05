import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Tooltip } from "ui";
import Providers from "../lib/providers";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <Component {...pageProps} />
        <Tooltip id="tooltip" />
      </Providers>
    </SessionProvider>
  );
}

export default appWithTranslation(App);
