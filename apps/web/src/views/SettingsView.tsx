import { PlayerRevealType } from "models";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Centered, InputStyles } from "ui";
import ToggleButton from "../components/ToggleButton";
import { useLocalStore } from "../hooks/store";

export default function SettingsView() {
  const { t } = useTranslation();

  const modifySettings = useLocalStore((it) => it.modifySettings);
  const fakePlayerScreens = useLocalStore((it) => it.fakePlayerScreens);
  const seerRevealType = useLocalStore((it) => it.seerRevealType);
  const deathRevealType = useLocalStore((it) => it.deathRevealType);

  return (
    <Centered horizontalOnly>
      <List>
        <li>
          <label htmlFor="fakePlayerScreens">
            {t("settings.fake_player_screens")}
          </label>
          <ToggleButton
            id="fakePlayerScreens"
            value={fakePlayerScreens}
            onChange={(fakePlayerScreens) =>
              modifySettings({ fakePlayerScreens })
            }
          />
        </li>

        <li>
          <label htmlFor="seerRevealType">
            {t("settings.seer_reveal_type")}
          </label>
          <RevealTypeSelect
            id="seerRevealType"
            value={seerRevealType}
            onChange={(seerRevealType) => modifySettings({ seerRevealType })}
          />
        </li>

        <li>
          <label htmlFor="deathRevealType">
            {t("settings.death_reveal_type")}
          </label>
          <RevealTypeSelect
            id="deathRevealType"
            value={deathRevealType}
            onChange={(deathRevealType) => modifySettings({ deathRevealType })}
          />
        </li>
      </List>
    </Centered>
  );
}

const REVEAL_TYPES: PlayerRevealType[] = [
  PlayerRevealType.ROLE,
  PlayerRevealType.GROUP,
  PlayerRevealType.NOTHING,
];

function RevealTypeSelect({
  value,
  onChange,
  ...props
}: Readonly<{
  id?: string;
  value: PlayerRevealType | undefined;
  onChange: Dispatch<PlayerRevealType>;
}>) {
  const { t } = useTranslation();

  return (
    <Select
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value as PlayerRevealType)}
    >
      {REVEAL_TYPES.map((type) => (
        <option key={type} value={type}>
          {t(`settings.reveal_type.${type}`)}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  ${InputStyles}
  border: none;
`;

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
