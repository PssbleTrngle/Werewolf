import { Role } from "models";
import { lighten } from "polished";
import { Dispatch, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Buttons, Dialog, DialogProps, tooltip, useRoles } from "ui";
import { useLocalStore } from "../../hooks/store.ts";
import useDialog from "../../hooks/useDialog";
import { stringifyImpact } from "../ImpactBadge";

export default function RoleSelectDialog({
  onSelect,
  initial,
  ...props
}: DialogProps &
  Readonly<{
    onSelect: Dispatch<Role>;
    initial?: string;
  }>) {
  const { t } = useTranslation();
  const { data: roles } = useRoles();
  const { render } = useDialog();
  const { disabledRoles } = useLocalStore();

  const possible = useMemo(
    () => roles.filter((it) => !disabledRoles.includes(it.type)),
    [roles, disabledRoles],
  );

  return render(
    <Dialog {...props}>
      <h2>{t("local:dialog.role_select")}</h2>
      <Grid>
        {possible.map((it) => (
          <RoleButton
            onClick={() => onSelect(it)}
            key={it.type}
            $selected={it.type === initial}
            {...tooltip(
              `${t(`role.${it.type}.name`)} (${stringifyImpact(it.impact)})`,
            )}
          >
            {it.emoji}
          </RoleButton>
        ))}
      </Grid>
      <Buttons>
        <Button onClick={props.onClose}>{t("button.cancel")}</Button>
      </Buttons>
    </Dialog>,
  );
}

const RoleButton = styled.li.attrs({ role: "button" })<{ $selected?: boolean }>`
  background: ${(p) => (p.$selected ? p.theme.accent : "transparent")};
  border-radius: 0.1em;
  aspect-ratio: 1 / 1;

  display: grid;
  align-items: center;

  &:hover {
    background: ${(p) =>
      lighten(0.1, p.$selected ? p.theme.accent : p.theme.bg)};
  }

  transition: background 0.1s linear;
`;

const Grid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 0.3em;
  font-size: 3em;

  [role="button"] {
    cursor: pointer;
  }
`;
