import { MIN_PLAYERS } from "logic";
import { Id, Player, Role, Status } from "models";
import { nanoid } from "nanoid";
import { Dispatch, FormEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  Button,
  Buttons,
  ButtonsCell,
  Centered,
  EditIcon,
  IconButton,
  Input,
  RoleIcon,
  ShuffleIcon,
  Table,
  TrashIcon,
  tooltip,
  useGameStatus,
  usePlayers,
} from "ui";
import InvisibleLink from "../components/InivisibleLink";
import RenameDialog from "../components/dialog/RenameDialog";
import RoleSelectDialog from "../components/dialog/RoleSelectDialog";
import { GAME_ID } from "../hooks/localGame";
import { useLocalStore } from "../hooks/store";
import randomNames from "../randomNames";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDialogAction<TState, TArgs extends any[]>(
  action: (value: TState, ...args: TArgs) => unknown
) {
  const [id, open] = useState<TState>();

  const close = useCallback(() => open(undefined), [open]);

  const execute = useCallback(
    (...args: TArgs) => {
      if (id) action(id, ...args);
      close();
    },
    [close, id, action]
  );

  return useMemo(
    () => ({ id, execute, open, close, visible: !!id }),
    [id, execute, open, close]
  );
}

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
      setName("");
    },
    [onAddPlayer, name]
  );

  return (
    <Form onSubmit={submit}>
      {import.meta.env.DEV && <RandomizeButton setName={setName} />}
      <Input
        type="text"
        placeholder={t("player.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button>{t("local:button.player.add")}</Button>
    </Form>
  );
}

function RandomizeButton({ setName }: Readonly<{ setName: Dispatch<string> }>) {
  const setRandomName = useCallback(() => {
    const [random] = randomNames.sort(() => Math.random() * 2 - 1);
    setName(random ?? "");
  }, [setName]);

  return (
    <IconButton type="button" onClick={setRandomName}>
      <ShuffleIcon />
    </IconButton>
  );
}

export default function PlayersView() {
  const { data } = useGameStatus();

  if (data.type === "game") return <ActivePlayersView />;
  return <PlayersEditView />;
}

const STATUS_ICONS: Record<Status, string> = {
  alive: "❤️",
  dead: "🪦",
  dying: "⚰️",
};

function ActivePlayersView() {
  const { t } = useTranslation();
  const { data: players } = usePlayers(GAME_ID);

  return (
    <Centered horizontalOnly>
      <Count>{t("player.count", { count: players.length })}</Count>
      <Table>
        <thead>
          <tr>
            <th>{t("player.name")}</th>
            <th>{t("role.title")}</th>
            <th>{t("player.status.title")}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((it) => (
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

  const { players, addPlayer, removePlayer, modifyPlayer, randomizeRoles } =
    useLocalStore();

  const canRandomize = useMemo(() => players.length >= MIN_PLAYERS, [players]);

  const selectRole = useCallback(
    (id: Id, role?: Role) => {
      modifyPlayer(id, { role });
    },
    [modifyPlayer]
  );

  const rename = useCallback(
    (id: Id, name: string) => {
      modifyPlayer(id, { name });
    },
    [modifyPlayer]
  );

  const roleSelectDialog = useDialogAction(selectRole);

  const renameDialog = useDialogAction(rename);

  return (
    <Centered horizontalOnly>
      <RoleSelectDialog
        visible={roleSelectDialog.visible}
        onClose={roleSelectDialog.close}
        onSelect={roleSelectDialog.execute}
        initial={
          players.find((it) => it.id === roleSelectDialog.id)?.role?.type
        }
      />

      <RenameDialog
        visible={renameDialog.visible}
        onClose={renameDialog.close}
        onChange={renameDialog.execute}
        initial={players.find((it) => it.id === renameDialog.id)?.name}
      />

      <AddPanel onAddPlayer={addPlayer} />
      <Count>{t("player.count", { count: players.length })}</Count>

      <Toolbar>
        <IconButton
          disabled={!canRandomize}
          onClick={randomizeRoles}
          {...(canRandomize
            ? {}
            : tooltip(
                t("local:error.min_players_requirement", {
                  count: MIN_PLAYERS,
                })
              ))}
        >
          {t("local:button.player.generate_roles")}
          <ShuffleIcon />
        </IconButton>
      </Toolbar>

      <Table>
        <tbody>
          {players.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              {it.role ? (
                <td>
                  {it.role.emoji} <i>{t(`role.${it.role.type}.name`)}</i>
                </td>
              ) : (
                <td />
              )}
              <ButtonsCell>
                <IconButton
                  onClick={() => renameDialog.open(it.id)}
                  {...tooltip(t("local:button.player.rename"))}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => roleSelectDialog.open(it.id)}
                  {...tooltip(t("local:button.player.select_role"))}
                >
                  <RoleIcon />
                </IconButton>
                <IconButton
                  error
                  onClick={() => removePlayer(it.id)}
                  {...tooltip(t("local:button.player.remove"))}
                >
                  <TrashIcon />
                </IconButton>
              </ButtonsCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </Centered>
  );
}

const Toolbar = styled(Buttons)`
  margin-bottom: 1em;
`;

const Count = styled.h2`
  padding: 0.2em;
`;

const Form = styled.form`
  margin: 1em 0;
  display: flex;
  gap: 0.5em;
`;
