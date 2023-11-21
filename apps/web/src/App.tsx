import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styled, { createGlobalStyle } from "styled-components";
import { createLocalGame } from "./client/local";
import EventScreen from "./components/EventScreen";
import { GameProvider } from "./hooks/game";

const client = new QueryClient();
const game = createLocalGame();

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
  width: 100dvw;
  background: #000;
  color: #bbb;
  font-family: sans-serif;
  display: grid;
  align-items: center;
  justify-content: center;
`;

export default App;
