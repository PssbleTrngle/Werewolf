import { RevealData } from "models";
import ParticipantList from "../ParticipantList";

export default function RevealDetails({ data }: { data: RevealData }) {
  return <ParticipantList size={2} players={data.targets} />;
}
