import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LocaleBackend from "i18next-http-backend";
import { Suspense } from "react";
import { initReactI18next } from "react-i18next";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { EventScreen, GameProvider, darkTheme } from "ui";
import ErrorWrapper from "./ErrorWrapper";
import { createLocalGame } from "./client/local";

const client = new QueryClient();
const game = createLocalGame();
const backend = new LocaleBackend(null, {
  loadPath: "/locales/{{lng}}.json",
});
i18n.use(initReactI18next).use(backend).init({ fallbackLng: "en" });

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Globals />
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorWrapper>
          <GameProvider value={game}>
            <QueryClientProvider client={client}>
              <Wrapper>
                <EventScreen />
              </Wrapper>
            </QueryClientProvider>
          </GameProvider>
        </ErrorWrapper>
      </Suspense>
    </ThemeProvider>
  );
}

const Globals = createGlobalStyle`
html, body, ul {
  margin: 0;
  padding: 0; 
}
`;

const Wrapper = styled.section`
  height: 100dvh;
`;

export default App;
