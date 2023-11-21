import { Player } from "models";
import styled from "styled-components";
import PlayerIcon from "./PlayerIcon";

export default function ParticipantList({
  players,
}: {
  players: ReadonlyArray<Player>;
}) {
  return (
    <Style>
      {players.map((player) => (
        <PlayerIcon key={player.id}>{player}</PlayerIcon>
      ))}
    </Style>
  );
}

const Style = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  gap: 1em;
`;
