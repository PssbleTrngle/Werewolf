import { Player } from "models";
import { styled } from "styled-components";

export default function PlayerIcon({ children }: { children: Player }) {
  return (
    <Style>
      {children.name} {children.role?.emoji}
    </Style>
  );
}

const Style = styled.div``;
