import { mix } from "polished";
import { useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Centered, EventScreen, Title, Tooltip } from "ui";
import FakeGame from "../components/FakeGame";

const gameId = "guide";

type Hint =
  | {
      key: string;
      target?: string;
    }
  | {
      key?: string;
      target: string;
    };

const HINTS: Hint[] = [
  { key: "intro" },
  { target: "event-role" },
  { target: "event-participants" },
  { target: "event-details" },
  { target: "event-choice" },
];

export default function GuideView() {
  const { t } = useTranslation();
  const [highlighted, moveHighlighted] = useReducer(
    (previous: Hint, by: number) => {
      const index = HINTS.indexOf(previous);
      return HINTS[(index + by + HINTS.length) % HINTS.length]!;
    },
    HINTS[0]!,
  );

  const hintTarget = useMemo(
    () => highlighted.target && `#${gameId}-${highlighted.target}`,
    [highlighted],
  );
  const hintTranslation = useMemo(
    () => `guide.${highlighted.key ?? highlighted.target}`,
    [highlighted],
  );

  return (
    <Centered>
      <Title>How to use the App</Title>

      <Notice>
        This app is made to be used by the moderator of the game and only them.
        There is an online version in the works, but no ETA yet.
      </Notice>

      <FakeGame>
        <Button onClick={() => moveHighlighted(-1)}>Back</Button>
        <Button onClick={() => moveHighlighted(1)}>Undestood</Button>

        <Example $highlighted={hintTarget}>
          <ExampleScreen gameId={gameId}>
            {hintTarget ? (
              <Hint
                content={t(hintTranslation)}
                anchorSelect={hintTarget}
                key={`${hintTarget}-tooltip`}
              />
            ) : (
              <GlobalHint>{t(hintTranslation)}</GlobalHint>
            )}
          </ExampleScreen>
        </Example>
      </FakeGame>
    </Centered>
  );
}

const Notice = styled.p``;

const Example = styled.section<{ $highlighted?: string }>`
  border: ${(p) => mix(0.5, p.theme.bg, p.theme.text)} 3px solid;
  width: 90%;
  max-width: 800px;
  aspect-ratio: 5 / 3;

  --lumary-offset: -250px;

  ${(p) => p.$highlighted} {
    outline: ${(p) => p.theme.accent} 2px dotted;
    outline-offset: 10px;
  }
`;

const ExampleScreen = styled(EventScreen)`
  width: max-content;
  margin: 0 auto;
`;

const Hint = styled(Tooltip).attrs({
  id: "guide-tooltip",
  isOpen: true,
  place: "left",
  offset: 20,
})`
  background: ${(p) => p.theme.accent} !important;
  z-index: 1000;
`;

const GlobalHint = styled.p`
  background: ${(p) => p.theme.accent};
  padding: 0.5em;
  text-align: center;
  width: fit-content;
  min-width: 200px;
  border-radius: 3px;
  position: absolute;

  left: 50%;
  transform: translateX(-50%);
`;
