import ActiveGame from "@/components/views/ActiveGame";
import GameLobby from "@/components/views/GameLobby";
import NoGame from "@/components/views/NoGame";
import Layout from "@/layout/default";
import { withPrefetched } from "@/lib/client/hydrateQueries";
import {
  lobbiesKey,
  selfLobbyKey,
  useSelfLobby,
} from "@/lib/client/remoteContext";
import { prefetchQueries } from "@/lib/server/prefetchQueries";
import { requireServerSession, requireSessionView } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";
import { GameStatus } from "storage/src/lobbies";
import { activeEventKey, gameInfoKey, playersKey } from "ui";

export const getServerSideProps = prefetchQueries(async (ctx, client) => {
  const session = await requireServerSession(ctx);
  const storage = await connectStorage();
  const lobby = await storage.lobbies.lobbyOf(session.user.id);

  await client.prefetchQuery({
    queryKey: selfLobbyKey(),
    queryFn: () => lobby,
  });

  if (lobby) {
    if (lobby.status !== GameStatus.NONE) {
      const view = await requireSessionView(session);

      await client.prefetchQuery({
        queryKey: activeEventKey(lobby.id),
        queryFn: () => view.currentEvent(),
      });

      await client.prefetchQuery({
        queryKey: gameInfoKey(lobby.id),
        queryFn: () => view.gameInfo(),
      });

      await client.prefetchQuery({
        queryKey: playersKey(lobby.id),
        queryFn: () => view.players(),
      });
    }
  } else {
    await client.prefetchQuery({
      queryKey: lobbiesKey(),
      queryFn: () => storage.lobbies.getLobbies(),
    });
  }
});

function GameView() {
  const { data: lobby } = useSelfLobby();

  if (lobby) {
    if (lobby.status === GameStatus.NONE) {
      return <GameLobby lobby={lobby} />;
    }

    return <ActiveGame gameId={lobby.id} />;
  }

  return <NoGame />;
}

function GamePage() {
  return (
    <Layout>
      <GameView />
    </Layout>
  );
}

export default withPrefetched(GamePage);
