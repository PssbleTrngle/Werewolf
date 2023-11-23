import { Time } from "models";
import { invert } from "polished";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled, { ThemeProvider } from "styled-components";
import { useActiveEvent, useGameStatus } from "../../hooks/game";
import darkTheme from "../../theme/dark";
import lightTheme from "../../theme/light";
import Background from "../background/Background";
import ChoicePanel from "./ChoicePanel";
import ControlBar from "./ControlBar";
import EventDetails from "./EventDetails";
import ParticipantList from "./ParticipantList";

function themeBy(time: Time) {
  switch (time) {
    case "dawn":
    case "day":
      return lightTheme;
    default:
      return darkTheme;
  }
}

export default function EventScreen() {
  const { data: event, error } = useActiveEvent();
  const { data: game } = useGameStatus();
  // const game = useFakeGame();
  const { t } = useTranslation();

  const theme = useMemo(() => themeBy(game?.time ?? "night"), [game]);

  if (error) return <p>an error occured</p>;
  if (!event || !game) return <p>...</p>;

  return (
    <ThemeProvider theme={theme}>
      <Style>
        <Background status={game} />
        <ControlBar />
        <EventWrapper>
          <ParticipantList size={1} players={event.players} />
          <h1>{t(`event.${event.type}.title`)}</h1>
          <EventDetails event={event} />
          {event?.choice && <ChoicePanel choice={event.choice} />}
        </EventWrapper>
      </Style>
    </ThemeProvider>
  );
}

const Style = styled.section`
  position: relative;

  text-align: center;

  user-select: none;

  font-family: sans-serif;
  color: ${(p) => p.theme.text};

  height: 100%;

  ::selection {
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  }
`;

const EventWrapper = styled.section`
  padding: 1em;
  margin-top: 5em;
`;
