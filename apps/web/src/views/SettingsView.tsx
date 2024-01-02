import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Buttons, Centered, IconButton, ResetIcon, RevealTypeSelect } from "ui";
import ToggleButton from "../components/ToggleButton";
import { useLocalStore } from "../hooks/store";
import { ReactNode, useId } from "react";

export default function SettingsView() {
  const { t } = useTranslation();
  const modify = useLocalStore((it) => it.modifySettings);
  const reset = useLocalStore((it) => it.resetSettings);

  const fakePlayerScreens = useLocalStore((it) => it.fakePlayerScreens);
  const amorCanChooseSelf = useLocalStore((it) => it.amorCanChooseSelf);
  const brokenHeartHeals = useLocalStore((it) => it.brokenHeartHeals);
  const guardCanChooseSelf = useLocalStore((it) => it.guardCanChooseSelf);

  const seerRevealType = useLocalStore((it) => it.seerRevealType);
  const deathRevealType = useLocalStore((it) => it.deathRevealType);
  const loveRevealType = useLocalStore((it) => it.loveRevealType);

  const lynchSkippable = useLocalStore((it) => it.lynchSkippable);

  return (
    <Centered horizontalOnly>
      <Toolbar>
        <IconButton onClick={reset}>
          {t("button.reset")} <ResetIcon />
        </IconButton>
      </Toolbar>

      <List>
        <Setting label="fake_player_screens">
          {(id) => (
            <ToggleButton
              id={id}
              value={fakePlayerScreens}
              onChange={(fakePlayerScreens) => modify({ fakePlayerScreens })}
            />
          )}
        </Setting>

        <Setting label="death_reveal_type">
          {(id) => (
            <RevealTypeSelect
              id={id}
              value={deathRevealType}
              onChange={(deathRevealType) => modify({ deathRevealType })}
            />
          )}
        </Setting>

        <Setting label="lynch_skip">
          {(id) => (
            <ToggleButton
              id={id}
              value={lynchSkippable}
              onChange={(lynchSkippable) => modify({ lynchSkippable })}
            />
          )}
        </Setting>

        <Section>
          <h4>{t("role.seer.name")}</h4>

          <Setting label="seer_reveal_type">
            {(id) => (
              <RevealTypeSelect
                id={id}
                value={seerRevealType}
                onChange={(seerRevealType) => modify({ seerRevealType })}
              />
            )}
          </Setting>
        </Section>

        <Section>
          <h4>{t("role.amor.name")}</h4>

          <Setting label="love_reveal_type">
            {(id) => (
              <RevealTypeSelect
                id={id}
                value={loveRevealType}
                onChange={(loveRevealType) => modify({ loveRevealType })}
              />
            )}
          </Setting>

          <Setting label="amor_can_choose_self">
            {(id) => (
              <ToggleButton
                id={id}
                value={amorCanChooseSelf}
                onChange={(amorCanChooseSelf) => modify({ amorCanChooseSelf })}
              />
            )}
          </Setting>

          <Setting label="broken_heart_heals">
            {(id) => (
              <ToggleButton
                id={id}
                value={brokenHeartHeals}
                onChange={(brokenHeartHeals) => modify({ brokenHeartHeals })}
              />
            )}
          </Setting>
        </Section>

        <Section>
          <h4>{t("role.guard.name")}</h4>

          <Setting label="guard_can_choose_self">
            {(id) => (
              <ToggleButton
                id={id}
                value={guardCanChooseSelf}
                onChange={(guardCanChooseSelf) =>
                  modify({ guardCanChooseSelf })
                }
              />
            )}
          </Setting>
        </Section>
      </List>
    </Centered>
  );
}

const Toolbar = styled(Buttons)`
  margin: 1em 0;
`;

const Section = styled.section`
  border-top: 1px solid ${(p) => p.theme.text};
  margin: 2em 0;
`;

function Setting({
  children,
  label,
}: Readonly<{ label: string; children: (id: string) => ReactNode }>) {
  const { t } = useTranslation();
  const id = useId();
  return (
    <li>
      <label htmlFor={id}>{t(`settings.${label}`)}</label>
      {children(id)}
    </li>
  );
}

const List = styled.ul`
  list-style: none;

  padding: 1em;

  li {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2em;
    align-items: center;
    margin: 1em 0;
  }
`;
