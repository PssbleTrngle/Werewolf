import { Choice } from "models";
import styled from "styled-components";
import { useVoteMutation } from "../hooks/game";

export default function ChoicePanel({ choice }: { choice: Choice }) {
  const { mutate: vote } = useVoteMutation();

  return (
    <Buttons>
      <PlayerButtons>
        {choice.players?.map((player) => (
          <button
            key={player.id}
            onClick={() => vote({ type: "players", players: [player.id] })}
          >
            {player.name}
          </button>
        ))}
      </PlayerButtons>
      {choice.canSkip && (
        <Skip onClick={() => vote({ type: "skip" })}>
          {choice.players?.length ? "Skip" : "Dismiss"}
        </Skip>
      )}
    </Buttons>
  );
}

const PlayerButtons = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  gap: 0.2em;
`;

const Buttons = styled.div`
  padding: 1em;
  gap: 1em;
  display: grid;
`;

const Skip = styled.button`
  margin: 0 auto;
`;
