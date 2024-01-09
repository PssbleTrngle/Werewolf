import { MIN_PLAYERS } from "logic";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Centered,
  ErrorMessage,
  EventScreen,
  Title,
  useCreateMutation,
  useGameStatus,
  useStopMutation,
} from "ui";
import { GAME_ID } from "../hooks/localGame";
import { useLocalStore } from "../hooks/store";

export default function EventsView() {
  const { data: status } = useGameStatus();

  if (status.type === "game") return <ActiveEventView />;
  return <CreateGame />;
}

function ActiveEventView() {
  const { t } = useTranslation();
  const { mutate: stop } = useStopMutation();

  return (
    <EventScreen gameId={GAME_ID}>
      <StopButton onClick={stop}> {t("button.game.stop")}</StopButton>
    </EventScreen>
  );
}

function CreateGame() {
  const { t } = useTranslation();
  const { mutate: create, error } = useCreateMutation();
  const players = useLocalStore((it) => it.players);

  const missingPlayers = players.length < MIN_PLAYERS;
  const missingRoles = players.some((it) => !it.role);

  const errorMessage = useMemo(() => {
    if (missingPlayers)
      return t("local:error.min_players_requirement", { count: MIN_PLAYERS });
    if (missingRoles) return t("local:error.missing_selected_roles");
    if (error) return error;
  }, [t, error, missingPlayers, missingRoles]);

  return (
    <Centered>
      <InnerCentered>
        <Logo src="/icons/icon.svg" />
        <Title>{t("local:status.game.no_active")}</Title>
        <ErrorMessage error={errorMessage} />
        <Button
          onClick={create}
          disabled={missingPlayers || missingRoles}
          error={!!error}
        >
          {t("button.game.create")}
        </Button>
      </InnerCentered>
    </Centered>
  );
}

const Logo = styled.img`
  height: 40vh;
  max-height: 70vw;
`;

const InnerCentered = styled(Centered)`
  height: 500px;
  padding-top: 100px;
`;

const StopButton = styled(Button)`
  position: absolute;
  z-index: 100;

  top: 1em;
  right: 1em;

  font-size: 0.5em;
`;
