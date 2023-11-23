import { GameStatus, Time } from "models";
import { invert } from "polished";
import { useEffect, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";
import styled, { ThemeProvider } from "styled-components";
import { useActiveEvent, useGameStatus } from "../../hooks/game";
import darkTheme from "../../theme/dark";
import lightTheme from "../../theme/light";
import ChoicePanel from "../ChoicePanel";
import ParticipantList from "../ParticipantList";
import Background from "../background/Background";
import EventDetails from "./EventDetails";

const TIMES: Time[] = ["dawn", "day", "dusk", "night"];

function themeBy(time: Time) {
  switch (time) {
    case "dawn":
    case "day":
      return lightTheme;
    default:
      return darkTheme;
  }
}

function useFakeGame() {
  const [i, increment] = useReducer((it: number) => it + 1, 0);

  useEffect(() => {
    const interval = setInterval(increment, 3_000);
    return () => clearInterval(interval);
  }, []);

  return useMemo<GameStatus>(
    () => ({
      time: TIMES[i % TIMES.length],
      day: Math.floor(i / TIMES.length),
    }),
    [i]
  );
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
      <Background status={game}>
        <Style>
          <ParticipantList size={1} players={event.players} />
          <h1>{t(`event.${event.type}.title`)}</h1>
          <EventDetails event={event} />
          {event?.choice && <ChoicePanel choice={event.choice} />}
        </Style>
      </Background>
    </ThemeProvider>
  );
}

const Style = styled.div`
  position: relative;

  text-align: center;

  height: 600px;
  padding: 1em;

  font-family: sans-serif;
  color: ${(p) => p.theme.text};

  ::selection {
    background: ${(p) => p.theme.text};
    color: ${(p) => invert(p.theme.text)};
  }
`;
