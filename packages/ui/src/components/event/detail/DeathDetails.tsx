import { DeathData } from "models";
import { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function DeathDetails({
  data,
  createTitle,
}: DetailProps<DeathData>) {
  return (
    <>
      {createTitle({ count: data.deaths.length })}
      <ParticipantList size={2} players={data.deaths} />
    </>
  );
}
