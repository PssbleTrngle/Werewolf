import { EventScreen, useActiveEvent, useGameStatus } from "ui";
import Layout from "../layout/default";
import { withPrefetched } from "../lib/client/hydrateQueries";
import { prefetchQueries } from "../lib/server/prefetchQueries";
import { requireSessionView } from "../lib/server/session";

export const getServerSideProps = prefetchQueries(async (ctx, client) => {
  const view = await requireSessionView(ctx);

  await client.prefetchQuery({
    queryKey: ["screen"],
    queryFn: () => view.currentEvent(),
  });

  await client.prefetchQuery({
    queryKey: ["game"],
    queryFn: () => view.status(),
  });
});

function GameView() {
  const { data: status } = useGameStatus();
  const { data: event } = useActiveEvent();

  if (!status) return <p>Not part of a game</p>;

  return (
    <Layout>
      <EventScreen event={event} status={status} />
    </Layout>
  );
}

export default withPrefetched(GameView);
