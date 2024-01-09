import { useLocalStore } from "@/lib/client/store";
import { ModeratorUser } from "@/lib/specialUsers";
import { useQueryClient } from "@tanstack/react-query";
import { Player, User } from "models";
import { lighten } from "polished";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
  IconButton,
  RolePanel,
  invalidateGameQueries,
  usePlayers,
  useWindowEvent,
} from "ui";

export default function ImpersonateControl({
  gameId,
}: Readonly<{ gameId: string }>) {
  const client = useQueryClient();

  const impersonate = useLocalStore((it) => it.impersonate);
  const impersonated = useLocalStore((it) => it.impersonated);

  const { data: players } = usePlayers(gameId);
  const [popupOpen, showPopup] = useState(false);

  const users = useMemo<Player[]>(() => [ModeratorUser, ...players], [players]);

  useWindowEvent("click", () => {
    showPopup(false);
  });

  const select = useCallback(
    async (user?: User) => {
      impersonate(user);
      showPopup(false);
      await invalidateGameQueries(client);
    },
    [impersonate, client, showPopup],
  );

  return (
    <Style onClick={(e) => e.stopPropagation()}>
      <IconButton onClick={() => showPopup(true)}>I</IconButton>
      {popupOpen && (
        <Popup>
          <PlayerButton onClick={() => select()} $selected={!impersonated}>
            Self
          </PlayerButton>
          {users.map((it) => (
            <PlayerButton
              key={it.id}
              onClick={() => select(it)}
              $selected={impersonated?.id === it.id}
            >
              {it.name} <RolePanel small role={it.role} />
            </PlayerButton>
          ))}
        </Popup>
      )}
    </Style>
  );
}

const PlayerButton = styled.li.attrs({ role: "button" })<{
  $selected: boolean;
}>`
  cursor: pointer;

  padding: 0.6em;
  text-align: left;

  background: ${(p) => (p.$selected ? lighten(0.1, p.theme.bg) : p.theme.bg)};

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 0.5em;

  &:hover {
    background: ${(p) => lighten(p.$selected ? 0.3 : 0.2, p.theme.bg)};
  }

  transition: background 0.1s linear;
`;

const Popup = styled.ul`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;

  list-style: none;
  display: grid;
  width: max-content;

  padding: 0.5em;
`;

const Style = styled.div`
  position: relative;
  grid-area: impersonate;
`;
