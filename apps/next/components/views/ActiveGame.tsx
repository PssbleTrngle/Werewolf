import { useLeaveMutation } from "@/lib/client/remoteContext";
import { Id } from "models";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, EventScreen, PlayerPanel, RolePanel, usePlayers } from "ui";

export default function ActiveGame({ gameId }: Readonly<{ gameId: Id }>) {
  const { t } = useTranslation("hub");
  const { data: players } = usePlayers(gameId);

  // TODO confirm dialog?
  const { mutate: leave } = useLeaveMutation(gameId);

  return (
    <Style>
      <EventScreen gameId={gameId}>
        <LeaveButton onClick={() => leave()}>
          {t("button.player.leave")}
        </LeaveButton>
      </EventScreen>
      <aside>
        <PlayerList>
          {players.map((player) => (
            <li key={player.id}>
              <RolePanel small role={player.role} />
              <PlayerPanel hideRole>{player}</PlayerPanel>
            </li>
          ))}
        </PlayerList>
      </aside>
    </Style>
  );
}

const PlayerList = styled.ul`
  display: grid;
  padding: 1em;
  gap: 1em;
  grid-template-columns: 1.5em 1fr;

  li {
    display: grid;
    grid-column: span 2;
    grid-template-columns: subgrid;
  }
`;

const Style = styled.section`
  display: grid;
  grid-template-columns: 1fr 400px;
`;

const LeaveButton = styled(Button)`
  position: absolute;
  z-index: 100;

  bottom: 1em;
  right: 1em;

  font-size: 0.5em;
`;
