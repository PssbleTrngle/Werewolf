import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Centered,
  ErrorMessage,
  EventScreen,
  useActiveEvent,
  useCreateMutation,
  useGameStatus,
  useStopMutation,
} from "ui";

export default function EventsView() {
  const { t } = useTranslation();
  const { data: status, isLoading } = useGameStatus();
  const { data: event } = useActiveEvent();

  const { mutate: stop } = useStopMutation();

  if (isLoading) return <p>Loading...</p>;
  if (status && event)
    return (
      <EventScreen status={status} event={event}>
        <StopButton onClick={stop}> {t("button.game.stop")}</StopButton>
      </EventScreen>
    );
  return <CreateGame />;
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
