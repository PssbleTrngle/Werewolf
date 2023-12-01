import { EventScreen, useActiveEvent, useGameStatus } from "ui";
import Layout from "../layout/default";
import { preloadTranslations } from "../lib/server/localization";

export const getStaticProps = preloadTranslations;

export default function GameView() {
  const { data: status } = useGameStatus();
  const { data: event } = useActiveEvent();

  if (!status || !event) return <p>...</p>;

  return (
    <Layout>
      <EventScreen event={event} status={status} />
    </Layout>
  );
}
