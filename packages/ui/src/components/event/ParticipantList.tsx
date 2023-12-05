import { Player } from "models";
import styled from "styled-components";
import PlayerIcon from "../PlayerIcon";

export default function ParticipantList({
  players,
  size,
  ...props
}: Readonly<{
  players: ReadonlyArray<Player>;
  size?: number;
}>) {
  return (
    <Style {...props}>
      {players.map((player) => (
        <PlayerIcon key={player.id} size={size}>
          {player}
        </PlayerIcon>
      ))}
    </Style>
  );
}

const Style = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  padding: 0.5em;
`;
