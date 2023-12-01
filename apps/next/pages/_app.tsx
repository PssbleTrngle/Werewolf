import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { GameProvider, darkTheme } from "ui";
import createRemoteContext from "../lib/client/remoteContext";
import { LocalizationForward } from "../lib/localization";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = useMemo(() => new QueryClient(), []);

  const context = useMemo(createRemoteContext, []);

  return (
    <LocalizationForward>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <GameProvider value={context}>
            <ThemeProvider theme={darkTheme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </GameProvider>
        </QueryClientProvider>
      </SessionProvider>
    </LocalizationForward>
  );
}

export default appWithTranslation(App);
