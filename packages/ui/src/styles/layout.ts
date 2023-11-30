import styled, { createGlobalStyle } from "styled-components";
import { XS } from "./screens";
import { invert } from "polished";
import { FOOTER_HEIGHT } from "../components/Footer";

export const Globals = createGlobalStyle`
html, body, ul {
  margin: 0;
  padding: 0; 
}
`;

export const Page = styled.main`
  min-height: 100dvh;
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
    "display" 1fr
    "footer" ${FOOTER_HEIGHT}px;

  ${XS} {
    grid-template:
      "display" 1fr
      "nav" auto;
  }
`;
