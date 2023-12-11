import { Villager, Werewolf } from "logic";
import { Role } from "models";
import { Dispatch, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import {
  Buttons,
  ButtonsCell,
  Centered,
  DisabledIcon,
  EnabledIcon,
  IconButton,
  ResetIcon,
  Table,
  tooltip,
  useRoles,
} from "ui";
import InvisibleLink from "../components/InivisibleLink";
import { useLocalStore } from "../hooks/store";

// These roles cannot be disabled
const frozenRoles = [Villager.type, Werewolf.type];

export default function RolesView() {
  const { data: roles } = useRoles();
  const { t } = useTranslation();

  const disabledRoles = useLocalStore((it) => it.disabledRoles);
  const toggleRole = useLocalStore((it) => it.toggleRole);
  const isEnabled = useCallback(
    (type: string) => !disabledRoles?.includes(type),
    [disabledRoles]
  );

  const reset = useCallback(
    () => disabledRoles?.forEach((it) => toggleRole(it, true)),
    [toggleRole, disabledRoles]
  );

  return (
    <Centered horizontalOnly>
      <Toolbar>
        <IconButton onClick={reset}>
          {t("button.reset")} <ResetIcon />
        </IconButton>
      </Toolbar>
      <Table>
        <thead>
          <tr>
            <th>{t("role.title")}</th>
            <th>{t("role.group.title")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {roles.map((it) => (
            <Row
              key={it.type}
              role={it}
              enabled={isEnabled(it.type)}
              onToggle={(value) => toggleRole(it.type, value)}
            />
          ))}
        </tbody>
      </Table>
    </Centered>
  );
}

const Toolbar = styled(Buttons)`
  margin: 1em 0;
`;

function Row({
  role,
  enabled,
  onToggle,
}: Readonly<{ role: Role; enabled: boolean; onToggle: Dispatch<boolean> }>) {
  const { t } = useTranslation();

  const disabledTooltip = useMemo(() => {
    if (frozenRoles.includes(role.type)) {
      return t("local:error.frozen_role");
    }
  }, [t, role]);

  return (
    <tr>
      <td>
        <InvisibleLink to={role.type}>
          {role.emoji}
          <Name $disabled={!enabled}>{t(`role.${role.type}.name`)}</Name>
        </InvisibleLink>
      </td>
      <td>
        {role.groups?.map((group) => (
          <span key={group}>{t(`role.group.${group}`)}</span>
        ))}
      </td>
      <ButtonsCell>
        <IconButton
          disabled={!!disabledTooltip}
          onClick={() => onToggle(!enabled)}
          {...tooltip(disabledTooltip)}
        >
          {enabled ? <EnabledIcon /> : <DisabledIcon />}
        </IconButton>
      </ButtonsCell>
    </tr>
  );
}

const DisabledStyle = css`
  font-style: italic;
  text-decoration: line-through;
  opacity: 0.5;
`;

const Name = styled.span<{ $disabled: boolean }>`
  margin-left: 1em;
  ${(p) => p.$disabled && DisabledStyle}
`;
