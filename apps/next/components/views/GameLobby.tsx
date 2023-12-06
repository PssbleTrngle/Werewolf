import { Id } from "models";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Buttons,
  Centered,
  ErrorMessage,
  IconButton,
  LeaveIcon,
  StartIcon,
  tooltip,
} from "ui";
import Layout from "@/layout/default";
import {
  useLeaveMutation,
  useLobby,
  useStartMutation,
} from "@/lib/client/remoteContext";

export default function GameLobby({ lobbyId }: Readonly<{ lobbyId: Id }>) {
  const { t } = useTranslation("hub");
  const { mutate: leave } = useLeaveMutation(lobbyId);
  const { mutate: start, error: startError } = useStartMutation(lobbyId);
  const { data: lobby } = useLobby(lobbyId);

  return (
    <Layout>
      <Centered>
        <p>Lobby {lobbyId}</p>

        <Players>
          {lobby.players.map((it) => (
            <li key={it.id}>{it.name}</li>
          ))}
        </Players>

        <Buttons>
          <IconButton
            onClick={() => leave()}
            {...tooltip(t("button.player.leave"))}
          >
            <LeaveIcon />
          </IconButton>

          <IconButton
            onClick={() => start()}
            {...tooltip(t("button.game.start"))}
            $error={!!startError}
          >
            <StartIcon />
          </IconButton>
        </Buttons>

        <ErrorMessage error={startError} />
      </Centered>
    </Layout>
  );
}

const Players = styled.ul``;
