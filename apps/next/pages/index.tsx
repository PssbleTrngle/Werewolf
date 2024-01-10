import GameLobby from "@/components/views/GameLobby";
import NoGame from "@/components/views/NoGame";
import Layout from "@/layout/default";
import { withPrefetched } from "@/lib/client/hydrateQueries";
import {
  lobbiesKey,
  selfLobbyKey,
  useLeaveMutation,
  useSelfLobby,
} from "@/lib/client/remoteContext";
import { prefetchQueries } from "@/lib/server/prefetchQueries";
import { requireServerSession, requireSessionView } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";
import { Id } from "models";
import { useTranslation } from "react-i18next";
import { GameStatus } from "storage/src/lobbies";
import styled from "styled-components";
import { Button, EventScreen, activeEventKey, gameInfoKey } from "ui";

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

function ActiveGame({ gameId }: Readonly<{ gameId: Id }>) {
  const { t } = useTranslation("hub");

  // TODO confirm dialog?
  const { mutate: leave } = useLeaveMutation(gameId);

  return (
    <EventScreen gameId={gameId}>
      <LeaveButton onClick={() => leave()}>
        {t("button.player.leave")}
      </LeaveButton>
    </EventScreen>
  );
}

const LeaveButton = styled(Button)`
  position: absolute;
  z-index: 100;

  bottom: 1em;
  right: 1em;

  font-size: 0.5em;
`;

function GamePage() {
  return (
    <Layout>
      <GameView />
    </Layout>
  );
}

export default withPrefetched(GamePage);
