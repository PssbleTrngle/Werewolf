import { Id, Time } from "models";
import { transparentize } from "polished";
import { PropsWithChildren, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useActiveEvent, useGameInfo } from "../..";
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
  gameId,
  children,
}: Readonly<
  PropsWithChildren<{
    gameId: Id;
  }>
>) {
  // TODO parallel?
  const { data: game } = useGameInfo(gameId);
  const { data: event } = useActiveEvent(gameId);

  const theme = useMemo(() => themeBy(game?.time ?? "night"), [game]);

  return (
    <ThemeProvider theme={theme}>
      <Background game={game}>
        {children}
        <Style>
          <ControlBar gameId={gameId} />
          <EventWrapper>
            <EventParticipantList size={1} players={event.players} />
            <EventDetails event={event} />
            {event?.choice && (
              <ChoicePanel choice={event.choice} key={event.type} />
            )}
          </EventWrapper>
        </Style>
      </Background>
    </ThemeProvider>
  );
}

const EventParticipantList = styled(ParticipantList)`
  & > * {
    background: ${(p) => transparentize(0.9, p.theme.text)};
  }
`;

const Style = styled.section`
  position: relative;

  text-align: center;

  user-select: none;
`;

const EventWrapper = styled.section`
  padding: 1em;
  margin-top: 5em;
`;
