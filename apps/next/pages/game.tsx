import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { EventScreen, useActiveEvent, useGameStatus } from "ui";
import Layout from "../layout/default";
import { preloadTranslations } from "../lib/server/localization";
import { requireSessionView } from "../lib/server/session";

type Props = Readonly<{
  dehydratedState: DehydratedState;
}>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new QueryClient();

  const view = await requireSessionView(ctx);

  await client.prefetchQuery({
    queryKey: ["screen"],
    queryFn: () => view.currentEvent(),
  });

  const { props } = await preloadTranslations(ctx);

  const dehydratedState = dehydrate(client);

  return { props: { ...props, dehydratedState } };
};

export default function GameView({ dehydratedState }: Props) {
  const { data: status } = useGameStatus();
  const { data: event } = useActiveEvent();

  if (!status || !event) return <p>...</p>;

  return (
    <HydrationBoundary state={dehydratedState}>
      <Layout>
        <EventScreen event={event} status={status} />
      </Layout>
    </HydrationBoundary>
  );
}
