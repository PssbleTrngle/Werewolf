import type { RevealData } from "models";
import type { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function RevealDetails({
  data,
  createTitle,
}: DetailProps<RevealData>) {
  return (
    <>
      {createTitle({ count: data.targets.length })}
      <ParticipantList size={2} players={data.targets} />
    </>
  );
}
