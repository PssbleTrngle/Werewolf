import { useTranslation } from "react-i18next";
import {
  Button,
  Centered,
  ErrorMessage,
  EventScreen,
  useActiveEvent,
  useCreateMutation,
  useGameStatus,
} from "ui";

export default function EventsView() {
  const { data: status, isLoading } = useGameStatus();
  const { data: event } = useActiveEvent();

  if (isLoading) return <p>Loading...</p>;
  if (status && event) return <EventScreen status={status} event={event} />;
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
      <Button onClick={create} error={!!error}>
        {t("button.game.create")}
      </Button>
    </Centered>
  );
}
