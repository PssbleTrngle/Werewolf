import { Player } from "models";
import { styled } from "styled-components";

export default function PlayerIcon({
  children,
  size = 1,
  ...props
}: {
  children: Player;
  size?: number;
}) {
  return (
    <Style $size={size} {...props}>
      {children.name} {children.role?.emoji}
    </Style>
  );
}

const Style = styled.div<{ $size: number }>`
  font-size: ${(p) => p.$size}em;
`;
