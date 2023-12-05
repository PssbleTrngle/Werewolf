import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { InputStyles, usePlayers } from "ui";
import useImpersonation from "../hooks/impersonate";
import { GAME_ID } from "../hooks/localGame";

function parseValue(value: string) {
  if (value === "") return undefined;
  return value;
}

export default function ImpersonationSelect() {
  const { t } = useTranslation();

  const [impersonated, impersonate] = useImpersonation();
  const { data: players } = usePlayers(GAME_ID);

  if (!players) return null;

  return (
    <Style
      value={impersonated}
      onChange={(e) => impersonate(parseValue(e.target.value))}
    >
      <option value="">{t("role.gamemaster.title")}</option>
      {players.map((it) => (
        <option value={it.id} key={it.id}>
          {it.name}
        </option>
      ))}
    </Style>
  );
}

const Style = styled.select`
  ${InputStyles}
  border: none;
`;
