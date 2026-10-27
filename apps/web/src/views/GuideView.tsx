import { MIN_PLAYERS } from "logic";
import { Villager } from "logic/src/game/role/villager";
import { Werewolf } from "logic/src/game/role/wolf";
import { useReducer } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Buttons,
  Centered,
  CheckIcon,
  EventScreen,
  HomeIcon,
  RolePanel,
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
      <Notice>
        This app is made to be used by the moderator of the game and only them.
        There is an online version in the works, but no ETA yet.
      </Notice>

      <SectionTitle>
        <UserIcon />
        {t("guide.section.players")}
      </SectionTitle>

      <Text>
        In the players tab you can add, remove & rename players. You need at
        least {MIN_PLAYERS} to start a game.
      </Text>
      <Text>
        You can asign the roles manually, or let the app asign them randomly
        until you like what you see.
      </Text>
      <Text>
        The badges <InlineBadge value={impact} /> next to the player names show
        how much the role impacts the game negativily or positivly. The badge on
        the top shows the summed up scores of all selected roles. The amount the
        values deviates from zero tells you how much the odds are stacked in
        favor of either the villagers or werewolfs.
      </Text>

      <SectionTitle>
        <HomeIcon />
        {t("guide.section.game")}
      </SectionTitle>

      <Text>
        The home tab can be used to start/stop and actually play the game. You
        can at any time exit the without interupting the game, but you cannot
        modify any of the players while a game is running.
      </Text>

      <Text>
        Below is an example of an active game, showing you what the different
        parts of the screen mean.
      </Text>

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
        {t("guide.section.settings")}
      </SectionTitle>

      <Text>
        In the roles tab you can disable or enable the various roles, with the
        exception of the <RolePanel role={Villager} /> and the{" "}
        <RolePanel role={Werewolf} />. These will be excluded from the role
        randomizer in the players tab.
      </Text>
      <Text>
        You can also slightly modify some additional parts of the game's logic
        in the settings tab.
      </Text>
    </Centered>
  );
}

const Text = styled.p`
  padding-inline: 1em;
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
