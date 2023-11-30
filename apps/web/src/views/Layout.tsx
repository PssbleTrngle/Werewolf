import { PropsWithChildren } from "react";
import { Footer, Globals, Page, AppInfo } from "ui";
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
      <Page>
        <NavBar />
        <section>{children}</section>
        <Footer {...appInfo} />
      </Page>
    </>
  );
}
