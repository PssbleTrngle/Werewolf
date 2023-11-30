import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { GameProvider } from "ui";
import createRemoteContext from "../hooks/gameContext";

const client = new QueryClient();
const context = createRemoteContext();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <GameProvider value={context}>
        <Component {...pageProps} />
      </GameProvider>
    </QueryClientProvider>
  );
}
