import { WinData } from "models";
import { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function WinDetails({
  data,
  createTitle,
}: DetailProps<WinData>) {
  return (
    <>
      {createTitle}
      <ParticipantList size={2} players={data.state.winners} />
    </>
  );
}
