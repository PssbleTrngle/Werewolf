import Head from "next/head";
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
    <>
      <Head>
        <title>Werewolf</title>
        <meta name="description" content="Play werewolf online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Globals />
        <NavBar />
        {children}
        <Footer {...appInfo} />
      </Page>
    </>
  );
}
