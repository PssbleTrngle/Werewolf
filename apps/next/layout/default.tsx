import NavBar from "@/components/NavBar";
import Head from "next/head";
import { ReactElement, Suspense } from "react";
import { AppInfo, Footer, Globals, Loading, Page } from "ui";

const appInfo: AppInfo = {
  repository: process.env.NEXT_PUBLIC_GIT_REPOSITORY,
  sha: process.env.NEXT_PUBLIC_GIT_SHA,
  version: process.env.NEXT_PUBLIC_GIT_VERSION,
};

export default function Layout({
  children,
}: Readonly<{ children: ReactElement }>) {
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
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Footer {...appInfo} />
      </Page>
    </>
  );
}
