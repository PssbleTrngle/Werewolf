import { Player } from "models";
import { useMemo } from "react";
import styled from "styled-components";
import RolePanel from "./RolePanel";

export default function PlayerPanel({
  children: { name, role },
  size = 1,
  hideRole = false,
  ...props
}: Readonly<{
  children: Pick<Player, "name" | "role">;
  size?: number;
  hideRole?: boolean;
}>) {
  const hasName = useMemo(() => !!name, [name]);
  return (
    <Style $size={size} {...props}>
      {name}
      {(hideRole && hasName) || <Role small={hasName} role={role} />}
    </Style>
  );
}

const Style = styled.span<{ $size: number }>`
  font-size: ${(p) => p.$size}em;

  border-radius: 0.2em;
  padding: 0.3em;
`;

const Role = styled(RolePanel)`
  margin-left: 0.25em;
`;
