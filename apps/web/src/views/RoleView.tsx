import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Centered, useRoles } from "ui";
import ImpactBadge from "../components/ImpactBadge";

export default function RoleView() {
  const { data: roles } = useRoles();
  const { t } = useTranslation();
  const params = useParams();
  const role = useMemo(
    () => roles.find((it) => it.type === params.type),
    [roles, params],
  );

  const [lore, ...description] = useMemo<string[]>(() => {
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
      <Title>
        {role.emoji} {t(`role.${role.type}.name`)}
        <Impact value={role.impact} />
      </Title>
      {!!role.groups?.length && (
        <p>
          {role.groups.map((group) => (
            <Badge key={group}>{t(`role.group.${group}`)}</Badge>
          ))}
        </p>
      )}
      <Description>
        <Lore>{lore}</Lore>
        {description.map((line, i) => (
          <p key={`line-${i}`}>{line}</p>
        ))}
      </Description>
    </Centered>
  );
}

const Lore = styled.p`
  font-style: italic;
  margin-bottom: 2em;
  text-align: center;

  &::before {
    content: "„";
  }

  &::after {
    content: "“";
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
`;

const Impact = styled(ImpactBadge)`
  font-size: 0.5em;
  margin-left: 1em;
`;

const Description = styled.div`
  padding: 0 2em;
  max-width: 1000px;
`;

const Badge = styled.span`
  background: ${(p) => p.theme.nav};
  padding: 0.5em;
  border-radius: 0.5em;
`;
