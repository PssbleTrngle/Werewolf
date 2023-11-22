import { DeathData } from "models";
import ParticipantList from "../../ParticipantList";

export default function DeathDetails({ data }: { data: DeathData }) {
  return <ParticipantList size={2} players={data.deaths} />;
}
