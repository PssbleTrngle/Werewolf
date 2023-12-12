import { useQueryClient } from "@tanstack/react-query";
import {
  EMPTY_ROLE_DATA,
  Game,
  Player as GamePlayer,
  GameState,
  ModeratorGameView,
  PlayerGameView,
  allRoles,
} from "logic";
import { GameStatus, Id, Player, Role, Vote } from "models";
import {
  Dispatch,
  DispatchWithoutAction,
  PropsWithChildren,
  useMemo,
  useReducer,
} from "react";
import { GameProvider, QueryContext, invalidateGameQueries } from "ui";
import { ImpersonationProvider } from "./impersonate";
import { GameStore, useLocalStore } from "./store";

export const GAME_ID = "local";

export function preparePlayers(
  players: ReadonlyArray<Player & Partial<Omit<GamePlayer, keyof Player>>>
): ReadonlyArray<GamePlayer> {
  return players.map(({ role, ...it }) => {
    if (!role) throw new Error(`Player ${it.name} is missing a role`);
    return {
      ...it,
      roleData: EMPTY_ROLE_DATA,
      status: "alive",
      role: role as Role,
    };
  });
}

function gameOf(history: ReadonlyArray<GameState>, save: GameStore["save"]) {
  const game = new Game(history);
  game.on("save", save);
  return game;
}

function createGame(onSave: GameStore["save"]) {
  const { players, ...settings } = useLocalStore.getState();
  if (!players) throw new Error("No players added yet");
  const prepared = preparePlayers(players);
  return gameOf(Game.createState(prepared, settings), onSave);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrap<T extends (...args: any[]) => any>(func: T) {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await func(...args);
    } catch (e) {
      if (import.meta.env.DEV && e instanceof Error) {
        /* eslint-disable no-console */
        console.error("an error occured in the logic package");
        console.error(e.stack ?? e.message);
        /* eslint-enable no-console */
      }
      throw e;
    }
  };
}

function requiresGame(): never {
  throw new Error("No game active");
}

function alreadyRunning(): never {
  throw new Error("Game already running");
}

const localContext = {
  roles: wrap(() => allRoles),
} satisfies Partial<QueryContext>;

function createEmptyContext(createGame: DispatchWithoutAction): QueryContext {
  return {
    ...localContext,
    create: wrap(createGame),
    gameStatus: wrap(() => ({ type: "lobby", id: GAME_ID }) as GameStatus),
    game: requiresGame,
    activeEvent: requiresGame,
    players: requiresGame,
    redo: requiresGame,
    stop: requiresGame,
    submitVote: requiresGame,
    undo: requiresGame,
  };
}

function createGameContextFor({
  game,
  stopGame,
  createGame,
  impersonated,
}: {
  game: Game | null;
  stopGame: DispatchWithoutAction;
  createGame: DispatchWithoutAction;
  impersonated?: Id;
}): QueryContext {
  if (!game) return createEmptyContext(createGame);

  const view = impersonated
    ? new PlayerGameView(game, impersonated)
    : new ModeratorGameView(game);

  return {
    ...localContext,
    create: alreadyRunning,
    stop: wrap(stopGame),
    gameStatus: wrap(() => ({ type: "game", id: GAME_ID }) as GameStatus),
    game: wrap(() => view.gameInfo()),
    players: wrap(() => view.players()),
    activeEvent: wrap(() => view.currentEvent()),
    submitVote: wrap((vote: Vote) => view.vote(vote)),
    undo: wrap(() => view.undo()),
    redo: wrap(() => view.redo()),
  };
}

interface ExtendedGameContext extends QueryContext {
  impersonate: Dispatch<Id | undefined>;
}

/**
 * This is neccessary, because react-client does not recreate query functions once the context changes
 */

function createLocalGame(onSave: GameStore["save"]): ExtendedGameContext {
  const savedHistory = useLocalStore.getState().history;
  let impersonated: Id | undefined = undefined;
  let game: Game | null = savedHistory && gameOf(savedHistory, onSave);

  function createScopedContext() {
    return createGameContextFor({
      game,
      impersonated,
      stopGame: () => setGame(null),
      createGame: () => setGame(createGame(onSave)),
    });
  }

  let actualContext: QueryContext = createScopedContext();

  function updateContext() {
    actualContext = createScopedContext();
  }

  function setGame(value: Game | null) {
    game = value;
    if (game) game.save();
    else onSave(null);
    updateContext();
  }

  function impersonate(value?: Id) {
    impersonated = value;
    updateContext();
  }

  return {
    gameStatus: (...args) => actualContext.gameStatus(...args),
    roles: (...args) => actualContext.roles(...args),
    players: (...args) => actualContext.players(...args),
    game: (...args) => actualContext.game(...args),
    activeEvent: (...args) => actualContext.activeEvent(...args),
    submitVote: (...args) => actualContext.submitVote(...args),
    undo: (...args) => actualContext.undo(...args),
    redo: (...args) => actualContext.redo(...args),
    stop: (...args) => actualContext.stop(...args),
    create: (...args) => actualContext.create(...args),
    impersonate,
  };
}

/*
export function useLocalGame(): QueryContext {
  const [game, setGame] = useReducer((_: Game | null, value: Game | null) => {
    if (!value) saveToLocalStorage(null);
    return value;
  }, readSavedGame());

  return useMemo(
    () => createGameContextFor({ game, setGame }),
    [game, setGame]
  );
}
*/

function useLocalGame() {
  const onSave = useLocalStore((it) => it.save);
  const context = useMemo(() => createLocalGame(onSave), [onSave]);
  return context;
}

export function LocalGameProvider(props: Readonly<PropsWithChildren>) {
  const client = useQueryClient();
  const context = useLocalGame();

  const impersonateState = useReducer(
    (_: Id | undefined, value: Id | undefined) => {
      context.impersonate(value);
      invalidateGameQueries(client);
      return value;
    },
    undefined
  );

  return (
    <ImpersonationProvider value={impersonateState}>
      <GameProvider {...props} value={context} />
    </ImpersonationProvider>
  );
}
