import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Centered,
  ErrorMessage,
  EventScreen,
  useCreateMutation,
  useGameStatus,
  useStopMutation,
} from "ui";
import { GAME_ID } from "../hooks/localGame";

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

  return (
    <Centered>
      <p>
        {error ? <ErrorMessage error={error} /> : t("status.game.no_active")}
      </p>
      <Button onClick={create} $error={!!error}>
        {t("button.game.create")}
      </Button>
    </Centered>
  );
}

const StopButton = styled(Button)`
  position: absolute;
  z-index: 100;

  top: 1em;
  right: 1em;

  font-size: 0.5em;
`;
