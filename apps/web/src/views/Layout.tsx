import { invert } from "polished";
import { PropsWithChildren } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { AppInfo, FOOTER_HEIGHT, Footer, XS } from "ui";
import NavBar from "../components/NavBar";

const appInfo: AppInfo = {
  repository: import.meta.env.VITE_REPOSITORY,
  sha: import.meta.env.VITE_SHA,
  version: import.meta.env.VITE_VERSION,
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <Globals />
      <Wrapper>
        <NavBar />
        <section>{children}</section>
        <Footer {...appInfo} />
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
