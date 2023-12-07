import { Role } from "models";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Dialog, DialogProps, tooltip, useRoles } from "ui";
import useDialog from "../../hooks/useDialog";

export default function RoleSelectDialog({
  onSelect,
  ...props
}: DialogProps &
  Readonly<{
    onSelect: Dispatch<Role>;
  }>) {
  const { t } = useTranslation();
  const { data: roles } = useRoles();
  const { render } = useDialog();

  return render(
    <Dialog {...props}>
      <h2>{t("local:dialog.role_select")}</h2>
      <Grid>
        {roles.map((it) => (
          <li
            onClick={() => onSelect(it)}
            key={it.type}
            role="button"
            {...tooltip(t(`role.${it.type}.name`))}
          >
            {it.emoji}
          </li>
        ))}
      </Grid>
    </Dialog>
  );
}

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
