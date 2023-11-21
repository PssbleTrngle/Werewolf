import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "i18next";
import LocaleBackend from "i18next-http-backend";
import { initReactI18next, useTranslation } from "react-i18next";
import styled, { createGlobalStyle } from "styled-components";
import { createLocalGame } from "./client/local";
import EventScreen from "./components/event/EventScreen";
import { GameProvider } from "./hooks/game";

const client = new QueryClient();
const game = createLocalGame();
const backend = new LocaleBackend(null, {
  loadPath: "/locales/{{lng}}.json",
});
i18n.use(initReactI18next).use(backend).init({ lng: "en_us" });

function App() {
  const { i18n } = useTranslation();

  console.log(i18n.languages);

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
  width: 100dvw;
  background: #000;
  color: #bbb;
  font-family: sans-serif;
  display: grid;
  align-items: center;
  justify-content: center;
`;

export default App;
