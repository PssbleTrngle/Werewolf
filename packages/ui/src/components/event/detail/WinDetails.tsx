import { WinData } from "models";
import { useTranslation } from "react-i18next";
import { Title } from "../../Text";
import { DetailProps } from "../EventDetails";
import ParticipantList from "../ParticipantList";

export default function WinDetails({ data }: DetailProps<WinData>) {
  const { t } = useTranslation();
  return (
    <>
      <Title>{t(`event.win.${data.state.type}.title`)}</Title>
      <ParticipantList size={2} players={data.state.winners} />
    </>
  );
}
