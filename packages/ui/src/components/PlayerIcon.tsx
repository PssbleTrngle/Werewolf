import { Player } from "models";
import { useMemo } from "react";
import styled from "styled-components";
import Button from "./Button";
import RolePanel from "./RolePanel";

export default function PlayerIcon({
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
  outline: 2px solid transparent;
  padding: 0.3em;

  &:hover {
    outline-color: ${(p) => p.theme.text};
  }

  ${Button} & {
    outline: none;
  }

  transition: outline 0.1s ease;
`;

const Role = styled(RolePanel)`
  margin-left: 0.25em;
`;
