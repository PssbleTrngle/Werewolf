import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { XS, useRoles } from "ui";
import InvisibleLink from "../components/InivisibleLink";

export default function RolesView() {
  const { data: roles } = useRoles();
  const { t } = useTranslation();

  return (
    <Grid>
      {roles.map((it) => (
        <InvisibleLink key={it.type} to={it.type}>
          <Panel>
            <span>{t(`role.${it.type}.name`)}</span>
            <Emoji>{it.emoji}</Emoji>
          </Panel>
        </InvisibleLink>
      ))}
    </Grid>
  );
}

const Panel = styled.li`
  height: var(--panel-size);
  background: #7772;
  border-radius: calc(var(--panel-size) / 10);

  text-align: center;
  align-items: center;

  display: grid;
  grid-template:
    "icon" 1fr
    "name" 2em;

  transition: background 0.1s linear;

  &:hover {
    background: #7774;
  }
`;

const Emoji = styled.span`
  grid-area: icon;
  font-size: 3em;
`;

const Grid = styled.ul`
  --panel-size: 150px;

  height: fit-content;

  display: grid;
  gap: 1em;
  padding: 1em;

  list-style: none;

  grid-template-columns: repeat(auto-fill, var(--panel-size));

  ${XS} {
    justify-content: space-evenly;
  }
`;
