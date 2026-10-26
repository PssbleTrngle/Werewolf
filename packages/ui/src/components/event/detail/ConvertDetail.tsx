import type { ConvertData } from "models";
import type { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function ConvertDetail({
  data,
  createTitle,
}: DetailProps<ConvertData>) {
  return (
    <>
      {createTitle()}
      <ParticipantList size={2} players={[data.player]} />
    </>
  );
}
