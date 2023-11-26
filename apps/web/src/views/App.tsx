import { invert } from "polished";
import { Outlet } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { XS } from "ui";
import NavBar from "../NavBar";

function App() {
  return (
    <>
      <Globals />
      <Wrapper>
        <NavBar />
        <section style={{ position: "relative" }}>
          <Outlet />
        </section>
      </Wrapper>
    </>
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
  display: grid;
  font-family: sans-serif;

  background: ${(p) => p.theme.bg};

  color: ${(p) => p.theme.text};

  ::selection {
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  }

  grid-template:
    "nav" auto
    "display" 1fr;

  ${XS} {
    grid-template:
      "display" 1fr
      "nav" auto;
  }
`;

export default App;
