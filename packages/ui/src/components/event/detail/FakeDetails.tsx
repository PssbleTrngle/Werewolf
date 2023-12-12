import { FakeData } from "models";
import EventDetails, { DetailProps } from "../EventDetails";
export default function FakeDetails({
  data,
  createTitle,
}: DetailProps<FakeData>) {
  return (
    <>
      <i>{createTitle()}</i>
      <EventDetails event={data} />
    </>
  );
}