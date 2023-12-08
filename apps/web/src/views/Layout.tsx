import { PropsWithChildren } from "react";
import { useInRouterContext } from "react-router-dom";
import { AppInfo, Footer, Globals, Page } from "ui";
import NavBar from "../components/NavBar";

const appInfo: AppInfo = {
  repository: import.meta.env.VITE_REPOSITORY,
  sha: import.meta.env.VITE_SHA,
  version: import.meta.env.VITE_VERSION,
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  const hasRouter = useInRouterContext();

  if (Array.isArray(children)) {
    throw new Error("router views should only return a single element");
  }

  return (
    <>
      <Globals />
      <Page>
        {hasRouter && <NavBar />}
        {children}
        <Footer {...appInfo} />
      </Page>
    </>
  );
}
