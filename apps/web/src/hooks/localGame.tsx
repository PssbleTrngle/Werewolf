import { useQueryClient } from "@tanstack/react-query";
import {
  EMPTY_ROLE_DATA,
  Game,
  GameState,
  ModeratorGameView,
  PlayerGameView,
  allRoles,
  generateRoles,
} from "logic";
import { GameStatus, Id, Player, Vote } from "models";
import { Dispatch, PropsWithChildren, useMemo, useReducer } from "react";
import { GameProvider, QueryContext, invalidateGameQueries } from "ui";
import { ImpersonationProvider } from "./impersonate";
import { readLocalStorage } from "./useLocalStorage";

export const GAME_ID = "local";
const STORAGE_KEY = "gamestate";

function saveToLocalStorage(history: ReadonlyArray<GameState> | null) {
  if (history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

class LocalGame extends Game {
  async onSave(history: ReadonlyArray<GameState>) {
    saveToLocalStorage(history);
  }
}

function createGame() {
  const players = readLocalStorage<ReadonlyArray<Player>>("players");
  if (!players) throw new Error("No players added yet");
  return new LocalGame(
    Game.createState(
      generateRoles(
        players.map((it) => ({
          ...it,
          status: "alive",
          roleData: EMPTY_ROLE_DATA,
        }))
      )
    )
  );
}

function readSavedGame() {
  const saved = readLocalStorage<ReadonlyArray<GameState>>(STORAGE_KEY);
  if (saved) {
    return new LocalGame(saved);
  } else {
    return null;
  }
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
        console.error(e.message);
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

function createEmptyContext(startGame: Dispatch<Game>): QueryContext {
  return {
    ...localContext,
    create: wrap(() => startGame(createGame())),
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

function createGameContextFor({
  game,
  setGame,
  impersonated,
}: {
  game: Game | null;
  setGame: Dispatch<Game | null>;
  impersonated?: Id;
}): QueryContext {
  if (!game) return createEmptyContext(setGame);

  const view = impersonated
    ? new PlayerGameView(game, impersonated)
    : new ModeratorGameView(game);

  return {
    ...localContext,
    create: alreadyRunning,
    stop: wrap(() => setGame(null)),
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
function createLocalGame(): ExtendedGameContext {
  let actualContext: QueryContext = createEmptyContext(() => {});
  let impersonated: Id | undefined = undefined;
  let game: Game | null = null;

  function updateContext() {
    actualContext = createGameContextFor({ game, setGame, impersonated });
  }

  function setGame(value: Game | null) {
    game = value;
    if (game) game.save();
    else saveToLocalStorage(null);
    updateContext();
  }

  function impersonate(value?: Id) {
    impersonated = value;
    updateContext();
  }

  setGame(readSavedGame());

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

export function LocalGameProvider(props: Readonly<PropsWithChildren>) {
  const client = useQueryClient();
  const context = useMemo(() => createLocalGame(), []);

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
