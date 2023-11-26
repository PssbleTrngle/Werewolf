import { RevealData } from "models";
import { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function RevealDetails({
  data,
  createTitle,
}: DetailProps<RevealData>) {
  return (
    <>
      {createTitle()}
      <ParticipantList size={2} players={data.targets} />
    </>
  );
}
