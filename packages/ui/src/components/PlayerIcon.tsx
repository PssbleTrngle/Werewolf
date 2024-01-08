import { Player } from "models";
import styled from "styled-components";
import RolePanel from "./RolePanel";

export default function PlayerIcon({
  children: { name, role, variant },
  size = 1,
  hideRole = false,
  ...props
}: Readonly<{
  children: Pick<Player, "name" | "role" | "variant">;
  size?: number;
  hideRole?: boolean
}>) {
  return (
    <Style $size={size} {...props}>
      {name}
      {hideRole || <Role small role={role} variant={variant} />}
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

  transition: outline 0.1s linear;
`;

const Role = styled(RolePanel)`
  margin-left: 0.25em;
`;
