import { Choice } from "models";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useVoteMutation } from "../../hooks/queries";
import { XS } from "../../styles/screens";
import Button from "../Button";
import PlayerIcon from "../PlayerIcon";

export default function ChoicePanel({ choice }: { choice: Choice }) {
  const { t } = useTranslation();
  const { mutate: vote } = useVoteMutation();

  return (
    <Buttons>
      <PlayerButtons>
        {choice.players?.map((player) => (
          <Button
            key={player.id}
            onClick={() => vote({ type: "players", players: [player.id] })}
          >
            <PlayerIcon>{player}</PlayerIcon>
          </Button>
        ))}
      </PlayerButtons>
      {choice.canSkip && (
        <Skip onClick={() => vote({ type: "skip" })}>
          {choice.players?.length ? t("button.skip") : t("button.dismiss")}
        </Skip>
      )}
    </Buttons>
  );
}

const PlayerButtons = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  gap: 0.5em;

  ${XS} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Buttons = styled.div`
  padding: 1em;
  gap: 1em;
  display: grid;
`;

const Skip = styled(Button)`
  margin: 0 auto;
`;
