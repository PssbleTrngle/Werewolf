import { Choice, Id } from "models";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useVoteMutation } from "../../hooks/queries";
import { XS } from "../../styles/screens";
import Button, { Buttons } from "../Button";
import PlayerPanel from "../PlayerPanel";

export default function ChoicePanel({ choice }: Readonly<{ choice: Choice }>) {
  const { t } = useTranslation();
  const { mutate: vote } = useVoteMutation();

  const multiple = useMemo(
    () => !!choice.players?.length && (choice.voteCount ?? 0) > 1,
    [choice],
  );

  const [selected, setSelected] = useState<Id[]>([]);

  const select = useCallback(
    (player: Id) => {
      if (multiple)
        setSelected((ids) => {
          if (ids.includes(player)) return ids.filter((it) => it !== player);
          return [player, ...ids].slice(0, choice.voteCount!);
        });
      else return vote({ type: "players", players: [player] });
    },
    [choice, multiple, vote],
  );

  return (
    <Style>
      {choice.players && (
        <PlayerButtons $count={choice.players.length}>
          {choice.players.map((player) => (
            <Button
              key={player.id}
              onClick={() => select(player.id)}
              selected={selected.includes(player.id)}
            >
              <PlayerPanel hideRole>{player}</PlayerPanel>
            </Button>
          ))}
        </PlayerButtons>
      )}
      <Buttons>
        {choice.canSkip && (
          <Button onClick={() => vote({ type: "skip" })}>
            {choice.players?.length ? t("button.skip") : t("button.dismiss")}
          </Button>
        )}
        {multiple && (
          <Button
            disabled={selected.length !== (choice?.voteCount ?? 1)}
            onClick={() => vote({ type: "players", players: selected })}
          >
            {t("button.submit")}
          </Button>
        )}
      </Buttons>
    </Style>
  );
}

const optimalColumns = (count: number) => {
  if (count < 5) return count;
  return Math.ceil(Math.sqrt(count));
};

const PlayerButtons = styled.ul<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => optimalColumns(p.$count)}, 1fr);

  justify-content: center;
  gap: 0.5em;

  margin: 0 auto;

  ${XS} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Style = styled.div`
  padding: 1em;
  gap: 1em;
  display: grid;
`;
