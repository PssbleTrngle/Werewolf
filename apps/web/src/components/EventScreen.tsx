import { styled } from "styled-components";
import { useActiveEvent } from "../hooks/game";
import ChoicePanel from "./ChoicePanel";
import PlayerIcon from "./PlayerIcon";

export default function EventScreen() {
  const { data, isLoading, isError } = useActiveEvent();

  if (isLoading) return <p>...</p>;
  if (isError) return <p>an error occured</p>;

  return (
    <div>
      <h1>{data!.type}</h1>
      <PlayerList>
        {data!.players.map((player) => (
          <PlayerIcon key={player.id}>{player}</PlayerIcon>
        ))}
      </PlayerList>
      {data?.choice && <ChoicePanel choice={data!.choice} />}
      <pre>{JSON.stringify(data?.data, null, 2)}</pre>
    </div>
  );
}

const PlayerList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  gap: 1em;
`;
