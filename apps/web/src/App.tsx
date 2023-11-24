import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LocaleBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import styled, { createGlobalStyle } from "styled-components";
import { EventScreen, GameProvider } from "ui";
import { createLocalGame } from "./client/local";

const client = new QueryClient();
const game = createLocalGame();
const backend = new LocaleBackend(null, {
  loadPath: "/locales/{{lng}}.json",
});
i18n.use(initReactI18next).use(backend).init({ lng: "en_us" });

function App() {
  return (
    <GameProvider value={game}>
      <QueryClientProvider client={client}>
        <Globals />
        <Wrapper>
          <EventScreen />
        </Wrapper>
      </QueryClientProvider>
    </GameProvider>
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
