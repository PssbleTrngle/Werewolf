import { PropsWithChildren } from "react";
import { Footer, Globals, Page } from "ui";
import NavBar from "../components/NavBar";

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