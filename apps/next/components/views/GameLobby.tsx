import { useLeaveMutation, useStartMutation } from "@/lib/client/remoteContext";
import { useTranslation } from "react-i18next";
import { Lobby } from "storage";
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

export default function GameLobby({ lobby }: Readonly<{ lobby: Lobby }>) {
  const { t } = useTranslation("hub");
  const { mutate: leave } = useLeaveMutation(lobby.id);
  const { mutate: start, error: startError } = useStartMutation(lobby.id);

  return (
    <Centered>
      <p>Lobby {lobby.id}</p>

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
          error={!!startError}
        >
          <StartIcon />
        </IconButton>
      </Buttons>

      <ErrorMessage error={startError} />
    </Centered>
  );
}

const Players = styled.ul``;
