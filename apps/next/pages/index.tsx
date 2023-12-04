import NextLink from "next/link";
import { Button, useCreateMutation, useGameStatus } from "ui";
import Layout from "../layout/default";
import { withPrefetched } from "../lib/client/hydrateQueries";
import { prefetchQueries } from "../lib/server/prefetchQueries";
import { sessionView } from "../lib/server/session";

export const getServerSideProps = prefetchQueries(async (ctx, client) => {
  const view = await sessionView(ctx);

  await client.prefetchQuery({
    queryKey: ["game"],
    queryFn: () => view?.status() ?? null,
  });
});

function Home() {
  const { data: status } = useGameStatus();
  const { mutate: create } = useCreateMutation();

  return (
    <Layout>
      <h1>
        {status ? (
          <NextLink href="/game">You are part of a game</NextLink>
        ) : (
          <Button onClick={() => create({})}>Create a game</Button>
        )}
      </h1>
    </Layout>
  );
}

export default withPrefetched(Home);
