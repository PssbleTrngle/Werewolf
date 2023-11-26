import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useRoles } from "ui";

export default function RoleView() {
  const { data: roles, isLoading } = useRoles();
  const { t } = useTranslation();
  const params = useParams();
  const role = useMemo(
    () => roles?.find((it) => it.type === params.type),
    [roles, params]
  );

  if (isLoading) return <p>...</p>;
  // TODO error?
  if (!role) return <p>Unknown Role</p>;

  return (
    <Style>
      <h1>
        {t(`role.${role.type}.name`)} {role.emoji}
      </h1>
      <p>{t(`role.${role.type}.description`)}</p>
    </Style>
  );
}

const Style = styled.section`
  display: grid;
  justify-content: center;
`;
