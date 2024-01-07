import { Player } from "models";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PlayerIcon from "../PlayerIcon";

export default function ParticipantList({
  players,
  size,
  max = Infinity,
  ...props
}: Readonly<{
  players: ReadonlyArray<Player>;
  size?: number;
  max?: number;
}>) {
  const { t } = useTranslation();
  const showMore = useMemo(() => players.length > max, [players, max]);
  const sliced = useMemo(() => players.slice(0, max), [players, max]);

  return (
    <Style {...props}>
      {sliced.map((player) => (
        <PlayerIcon key={player.id} size={size}>
          {player}
        </PlayerIcon>
      ))}
      {showMore && (
        <More size={size}>
          {{ name: t("more", { count: players.length - max }) }}
        </More>
      )}
    </Style>
  );
}

const More = styled(PlayerIcon)`
  font-style: italic;
`;

const Style = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 1em;
  padding: 0.5em;
`;
