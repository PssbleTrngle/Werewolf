import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GameProvider, darkTheme } from "ui";
import createRemoteContext from "../lib/gameContext";

const client = new QueryClient();
const context = createRemoteContext();

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={client}>
        <GameProvider value={context}>
          <ThemeProvider theme={darkTheme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </GameProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App);
