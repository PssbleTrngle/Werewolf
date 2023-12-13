import GameLobby from "@/components/views/GameLobby";
import NoGame from "@/components/views/NoGame";
import Layout from "@/layout/default";
import { withPrefetched } from "@/lib/client/hydrateQueries";
import { lobbiesKey, lobbyKey } from "@/lib/client/remoteContext";
import { prefetchQueries } from "@/lib/server/prefetchQueries";
import { requireServerSession, requireSessionView } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";
import { Id } from "models";
import {
  EventScreen,
  activeEventKey,
  gameInfoKey,
  gameStatusKey,
  useGameStatus,
} from "ui";

export const getServerSideProps = prefetchQueries(async (ctx, client) => {
  const session = await requireServerSession(ctx);
  const storage = await connectStorage();
  const status = await storage.statusOf(session.user.id);

  await client.prefetchQuery({
    queryKey: gameStatusKey(),
    queryFn: () => status,
  });

  if (status.type === "game") {
    const view = await requireSessionView(session);

    await client.prefetchQuery({
      queryKey: activeEventKey(status.id),
      queryFn: () => view.currentEvent(),
    });

    await client.prefetchQuery({
      queryKey: gameInfoKey(status.id),
      queryFn: () => view.gameInfo(),
    });
  }

  if (status.type === "lobby") {
    await client.prefetchQuery({
      queryKey: lobbyKey(status.id),
      queryFn: () => storage.lobbies.getLobby(status.id),
    });
  }

  if (status.type === "none") {
    await client.prefetchQuery({
      queryKey: lobbiesKey(),
      queryFn: () => storage.lobbies.getLobbies(),
    });
  }
});

function GameView() {
  const { data: status } = useGameStatus();

  switch (status.type) {
    case "game":
      return <ActiveGame gameId={status.id} />;
    case "lobby":
      return <GameLobby lobbyId={status.id} />;
    case "none":
      return <NoGame />;
  }
}

function ActiveGame({ gameId }: Readonly<{ gameId: Id }>) {
  return <EventScreen gameId={gameId} />;
}

function GamePage() {
  return (
    <Layout>
      <GameView />
    </Layout>
  );
}

export default withPrefetched(GamePage);
