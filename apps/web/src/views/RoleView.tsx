import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Centered, useRoles } from "ui";

export default function RoleView() {
  const { data: roles } = useRoles();
  const { t } = useTranslation();
  const params = useParams();
  const role = useMemo(
    () => roles.find((it) => it.type === params.type),
    [roles, params]
  );

  const description = useMemo<string[]>(() => {
    if (!role) return [];
    const translation = t(`role.${role.type}.description`, {
      returnObjects: true,
    });

    if (Array.isArray(translation)) return translation;
    return [translation];
  }, [t, role]);

  // TODO error?
  if (!role) return <p>Unknown Role</p>;

  return (
    <Centered horizontalOnly>
      <h1>
        {t(`role.${role.type}.name`)} {role.emoji}
      </h1>
      {!!role.groups?.length && (
        <p>
          {role.groups.map((group) => (
            <Badge key={group}>{t(`role.group.${group}`)}</Badge>
          ))}
        </p>
      )}
      <Description>
        {description.map((line, i) => (
          <p key={`line-${i}`}>{line}</p>
        ))}
      </Description>
    </Centered>
  );
}

const Description = styled.div`
  padding: 0 2em;
  max-width: 1000px;
`;

const Badge = styled.span`
  background: ${(p) => p.theme.nav};
  padding: 0.5em;
  border-radius: 0.5em;
`;
