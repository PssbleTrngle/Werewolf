import { RevealData } from "models";
import ParticipantList from "../../ParticipantList";

export default function RevealDetail({ data }: { data: RevealData }) {
  return <ParticipantList players={data.targets} />;
}
