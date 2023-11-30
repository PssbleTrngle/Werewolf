import { EventScreen, useActiveEvent, useGameStatus } from "ui";

export default function GameView() {
  const { data: status } = useGameStatus();
  const { data: event } = useActiveEvent();

  if (!status || !event) return <p>...</p>;

  return (
    <main>
      <EventScreen event={event} status={status} />
    </main>
  );
}
