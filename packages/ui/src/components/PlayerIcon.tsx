import { Player } from "models";
import styled from "styled-components";
import RolePanel from "./RolePanel";

export default function PlayerIcon({
  children: { name, role },
  size = 1,
  ...props
}: Readonly<{
  children: Player;
  size?: number;
}>) {
  return (
    <Style $size={size} {...props}>
      {name}
      <Role small role={role} />
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
