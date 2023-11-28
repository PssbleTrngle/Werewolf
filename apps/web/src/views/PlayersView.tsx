import { MIN_PLAYERS } from "logic";
import { Id, Player, Status } from "models";
import { nanoid } from "nanoid";
import { FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Centered, Input, useGameStatus, usePlayers } from "ui";
import InvisibleLink from "../InivisibleLink";
import useLocalStorage from "../hooks/useLocalStorage";

function AddPanel({
  onAddPlayer,
}: Readonly<{
  onAddPlayer: (player: Player) => void;
}>) {
  const { t } = useTranslation();

  const [name, setName] = useState("");

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onAddPlayer({ id: nanoid(), name });
    },
    [onAddPlayer, name]
  );

  return (
    <Form onSubmit={submit}>
      <Input
        type="text"
        placeholder={t("player.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button>{t("button.player.add")}</Button>
    </Form>
  );
}

export default function PlayersView() {
  const { data, isLoading } = useGameStatus();

  if (isLoading) return <p>...</p>;
  if (data) return <ActivePlayersView />;
  return <PlayersEditView />;
}

const STATUS_ICONS: Record<Status, string> = {
  alive: "❤️",
  dead: "🪦",
  dying: "⚰️",
};

function ActivePlayersView() {
  const { t } = useTranslation();
  const { data: players } = usePlayers();

  return (
    <Centered>
      <Count>{t("player.count", { count: players?.length ?? 0 })}</Count>
      <Table>
        <thead>
          <tr>
            <th>{t("player.name")}</th>
            <th>{t("role.title")}</th>
            <th>{t("player.status.title")}</th>
          </tr>
        </thead>
        <tbody>
          {players?.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              {it.role ? (
                <td>
                  <InvisibleLink to={`/roles/${it.role.type}`}>
                    {it.role.emoji} {t(`role.${it.role.type}.name`)}
                  </InvisibleLink>
                </td>
              ) : (
                <td />
              )}
              {it.status ? (
                <td>
                  {STATUS_ICONS[it.status]} {t(`player.status.${it.status}`)}
                </td>
              ) : (
                <td />
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Centered>
  );
}

function PlayersEditView() {
  const { t } = useTranslation();

  const [players, setPlayers] = useLocalStorage<Player[]>("players", () => []);
  const addPlayer = useCallback(
    (player: Player) => setPlayers((it) => [...it, player]),
    [setPlayers]
  );
  const removePlayer = useCallback(
    (id: Id) => setPlayers((players) => players.filter((it) => it.id !== id)),
    [setPlayers]
  );

  return (
    <Centered>
      {players.length < MIN_PLAYERS && (
        <p>{t("error.min_players_requirement", { count: MIN_PLAYERS })}</p>
      )}
      <AddPanel onAddPlayer={addPlayer} />
      <Table>
        <tbody>
          {players.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              <Buttons>
                <Button onClick={() => removePlayer(it.id)}>
                  {t("button.player.remove")}
                </Button>
                <Button>{t("button.player.rename")}</Button>
              </Buttons>
            </tr>
          ))}
        </tbody>
      </Table>
    </Centered>
  );
}

const Buttons = styled.td`
  text-align: right;
  ${Button}:not(:last-child) {
    margin-right: 1em;
  }
`;

const Count = styled.h2`
  padding: 0.2em;
`;

const Form = styled.form`
  margin: 1em 0;
`;

const Table = styled.table`
  width: 100%;
  max-width: 800px;

  border-collapse: collapse;

  td,
  th {
    padding: 1em;
  }

  thead {
    background: #7774;
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background: #7772;
  }
`;
