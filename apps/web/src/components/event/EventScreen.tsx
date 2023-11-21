import { useTranslation } from "react-i18next";
import { useActiveEvent } from "../../hooks/game";
import ChoicePanel from "../ChoicePanel";
import ParticipantList from "../ParticipantList";
import EventDetails from "./EventDetails";

export default function EventScreen() {
  const { data, isLoading, isError } = useActiveEvent();
  const { t } = useTranslation();

  if (isLoading) return <p>...</p>;
  if (isError) return <p>an error occured</p>;

  return (
    <div>
      <h1>{t(`event.${data!.type}.title`)}</h1>
      <EventDetails event={data!} />
      <ParticipantList players={data!.players} />
      {data?.choice && <ChoicePanel choice={data!.choice} />}
    </div>
  );
}
