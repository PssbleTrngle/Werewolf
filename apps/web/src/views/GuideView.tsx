import { MIN_PLAYERS } from "logic";
import { useReducer } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Buttons,
  Centered,
  CheckIcon,
  EventScreen,
  HomeIcon,
  SettingsIcon,
  Title,
  UserIcon,
} from "ui";
import FakeGame from "../components/guide/FakeGame";
import HintComponent from "../components/guide/Hint";
import ImpactBadge from "../components/ImpactBadge";
import useHints, { type Hint } from "../hooks/hints";
import { useInterval } from "../hooks/timed";

const GAME_ID = "guide";

const HINTS: Hint[] = [
  { key: "intro" },
  { target: "event-role" },
  { target: "event-participants" },
  { target: "event-details" },
  { target: "event-choice" },
  { target: "undo" },
  { target: "redo" },
  { key: "outro", icon: <CheckIcon /> },
];

export default function GuideView() {
  const { t } = useTranslation("local");
  const hint = useHints(GAME_ID, HINTS);
  const [impact, cycleImpact] = useReducer(
    (_) => Math.floor(Math.random() * 10 - 5),
    0,
  );

  useInterval(cycleImpact, 2000);

  return (
    <Centered>
      <Title>{t("guide.title")}</Title>
      <Notice>{t("guide.notice")}</Notice>

      <SectionTitle>
        <UserIcon />
        {t("guide.section.players.title")}
      </SectionTitle>

      <Text>{t("guide.section.players.manage", { min: MIN_PLAYERS })}</Text>
      <Text>{t("guide.section.players.roles")}</Text>
      <Text>
        <Trans
          ns="local"
          i18nKey="guide.section.players.impact"
          components={{ badge: <InlineBadge value={impact} /> }}
        />
      </Text>

      <SectionTitle>
        <HomeIcon />
        {t("guide.section.game.title")}
      </SectionTitle>

      <Text>{t("guide.section.game.manage")}</Text>
      <Text>{t("guide.section.game.example")}</Text>

      <FakeGame>
        <Controls>
          <Button disabled={!hint.previous} onClick={hint.previous}>
            {t("guide.previous")}
          </Button>
          <Button disabled={!hint.next} onClick={hint.next} primary>
            {t("guide.next")}
          </Button>
        </Controls>

        <Example $highlighted={hint.target}>
          <ExampleScreen gameId={GAME_ID}>
            <HintComponent hint={hint} />
          </ExampleScreen>
        </Example>
      </FakeGame>

      <SectionTitle>
        <SettingsIcon />
        {t("guide.section.settings.title")}
      </SectionTitle>

      <Text>{t("guide.section.settings.roles")}</Text>
      <Text>{t("guide.section.settings.additional")}</Text>
    </Centered>
  );
}

const Text = styled.p`
  width: 1000px;
  max-width: 95dvw;
`;

const Notice = styled(Text)`
  margin-bottom: 2em;
`;

const Example = styled.section<{ $highlighted?: string }>`
  width: 99vw;

  --lumary-offset: -30dvw;
  --lumary-horizon: 420px;

  ${(p) => p.$highlighted} {
    outline: ${(p) => p.theme.accent} 2px dotted;
    outline-offset: 10px;
  }
`;

const ExampleScreen = styled(EventScreen)`
  width: max-content;
  max-width: 95dvw;
  margin: 0 auto;
`;

const Controls = styled(Buttons)`
  grid-template-columns: 1fr 1fr;
  margin-block: 1em;
`;

const SectionTitle = styled.h2`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0.5em;

  margin-top: 2em;

  svg {
    height: 1em;
  }
`;

const InlineBadge = styled(ImpactBadge)`
  font-size: 0.7em;
  line-height: 1em;
  margin-inline: 0.1em;

  transform: translateY(-5%);
`;
