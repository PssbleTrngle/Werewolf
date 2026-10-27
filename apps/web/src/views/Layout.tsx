import type { PropsWithChildren } from "react";
import { useInRouterContext } from "react-router-dom";
import styled from "styled-components";
import { Footer, Globals, MOBILE_NAV_HEIGHT, Page, XS } from "ui";
import NavBar from "../components/NavBar";
import { appInfo } from "../lib/appInfo";

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const hasRouter = useInRouterContext();

  return (
    <>
      <Globals />
      <Page>
        <Content>{children}</Content>
        <Footer {...appInfo} />
        {hasRouter && <NavBar />}
      </Page>
    </>
  );
}

const Content = styled.section`
  height: 100%;
  width: 100%;

  ${XS} {
    overflow-y: scroll;
    max-height: calc(100dvh - ${MOBILE_NAV_HEIGHT});
  }
`;
