import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { GameProvider, darkTheme } from "ui";
import createRemoteContext from "./client/remoteContext";
import { LocalizationForward } from "./localization";

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  const client = useMemo(() => new QueryClient(), []);

  const context = useMemo(createRemoteContext, []);

  return (
    <LocalizationForward>
      <QueryClientProvider client={client}>
        <GameProvider value={context}>
          <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
        </GameProvider>
      </QueryClientProvider>
    </LocalizationForward>
  );
}
