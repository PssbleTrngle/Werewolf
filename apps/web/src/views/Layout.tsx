import { PropsWithChildren } from "react";
import { useInRouterContext } from "react-router-dom";
import styled from "styled-components";
import { AppInfo, Footer, Globals, MOBILE_NAV_HEIGHT, Page, XS } from "ui";
import NavBar from "../components/NavBar";

const appInfo: AppInfo = {
  repository: import.meta.env.VITE_REPOSITORY,
  sha: import.meta.env.VITE_SHA,
  version: import.meta.env.VITE_VERSION,
};

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
