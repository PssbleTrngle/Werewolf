import { Event, GameStatus, Time } from "models";
import { PropsWithChildren, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
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

export default function EventScreen({
  status,
  event,
  children,
}: Readonly<
  PropsWithChildren<{
    status: GameStatus;
    event: Event<unknown>;
  }>
>) {
  // const game = useFakeGame();

  const theme = useMemo(() => themeBy(status?.time ?? "night"), [status]);

  return (
    <ThemeProvider theme={theme}>
      <Background status={status}>
        {children}
        <Style>
          <ControlBar />
          <EventWrapper>
            <ParticipantList size={1} players={event.players} />
            <EventDetails event={event} />
            {event?.choice && <ChoicePanel choice={event.choice} />}
          </EventWrapper>
        </Style>
      </Background>
    </ThemeProvider>
  );
}

const Style = styled.section`
  position: relative;

  text-align: center;

  user-select: none;
`;

const EventWrapper = styled.section`
  padding: 1em;
  margin-top: 5em;
`;
