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
import { Id, Player, Vote } from "models";
import { Dispatch, PropsWithChildren, useMemo, useReducer } from "react";
import { GameContext, GameProvider, invalidateGameQueries } from "ui";
import { ImpersonationProvider } from "./impersonate";
import { readLocalStorage } from "./useLocalStorage";

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
} satisfies Partial<GameContext>;

function createEmptyContext(startGame: Dispatch<Game>): GameContext {
  return {
    ...localContext,
    create: wrap(() => startGame(createGame())),
    game: wrap(() => null),
    activeEvent: requiresGame,
    players: requiresGame,
    redo: requiresGame,
    stop: requiresGame,
    submitVote: requiresGame,
    undo: requiresGame,
  };
}

export function useLocalGame(): GameContext {
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
}): GameContext {
  if (!game) return createEmptyContext(setGame);

  const view = impersonated
    ? new PlayerGameView(game, impersonated)
    : new ModeratorGameView(game);

  return {
    ...localContext,
    create: alreadyRunning,
    stop: wrap(() => setGame(null)),
    game: wrap(() => view.status()),
    players: wrap(() => view.players()),
    activeEvent: wrap(() => view.currentEvent()),
    submitVote: wrap((vote: Vote) => view.vote(vote)),
    undo: wrap(() => view.undo()),
    redo: wrap(() => view.redo()),
  };
}

interface ExtendedGameContext extends GameContext {
  impersonate: Dispatch<Id | undefined>;
}

/**
 * This is neccessary, because react-client does not recreate query functions once the context changes
 */
function createLocalGame(): ExtendedGameContext {
  let actualContext: GameContext = createEmptyContext(() => {});
  let impersonated: Id | undefined = undefined;
  let game: Game | null = null;

  function updateContext() {
    actualContext = createGameContextFor({ game, setGame, impersonated });
  }

  function setGame(value: Game | null) {
    game = value;
    game?.save();
    updateContext();
  }

  function impersonate(value?: Id) {
    impersonated = value;
    updateContext();
  }

  setGame(readSavedGame());

  return {
    roles: () => actualContext.roles(),
    players: () => actualContext.players(),
    game: () => actualContext.game(),
    activeEvent: () => actualContext.activeEvent(),
    submitVote: (vote) => actualContext.submitVote(vote),
    undo: () => actualContext.undo(),
    redo: () => actualContext.redo(),
    stop: () => actualContext.stop(),
    create: () => actualContext.create(),
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
