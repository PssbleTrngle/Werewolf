import { PropsWithChildren } from "react";
import { AppInfo, Footer, Globals, Page } from "ui";
import NavBar from "../components/NavBar";

const appInfo: AppInfo = {
  repository: process.env.NEXT_PUBLIC_GIT_REPOSITORY,
  sha: process.env.NEXT_PUBLIC_GIT_SHA,
  version: process.env.NEXT_PUBLIC_GIT_VERSION,
};

export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <Page>
      <Globals />
      <NavBar />
      {children}
      <Footer {...appInfo} />
    </Page>
  );
}
