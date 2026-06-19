import createRemoteContext from "@/lib/client/remoteContext";
import { LocalizationForward } from "@/lib/localization";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { GameProvider, darkTheme } from "ui";

export default function Providers({ children }: Readonly<PropsWithChildren>) {
  const client = useMemo(() => new QueryClient(), []);

  const context = useMemo(() => createRemoteContext(), []);

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
