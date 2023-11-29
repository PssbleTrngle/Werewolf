import { Game, GameState, allRoles, generateRoles } from "logic";
import { Id, Player, Vote } from "models";
import { Dispatch, PropsWithChildren, useMemo, useReducer } from "react";
import { GameContext, GameProvider } from "ui";
import { ImpersonationProvider } from "./impersonate";
import { readLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "gamestate";

function createGame() {
  const players = readLocalStorage<ReadonlyArray<Player>>("players");
  if (!players) throw new Error("No players added yet");
  return Game.create(
    generateRoles(
      players.map((it) => ({
        ...it,
        status: "alive",
        roleData: {},
      }))
    )
  );
}

function readSavedGame() {
  const saved = readLocalStorage<ReadonlyArray<GameState>>(STORAGE_KEY);
  if (saved) {
    return Game.read(saved);
  } else {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrap<T extends (...args: any[]) => any>(func: T) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return func(...args);
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

/*
function createState() {
  let game = readSavedGame();
  let view: GameView | null = game && new ModeratorGameView(game);

  function require() {
    if (!view) throw new Error("No game active");
    return view;
  }

  function save() {
    if (game) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game.save()));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function set(value: Game | null) {
    game = value;
    view = value && new ModeratorGameView(value);
    save();
  }

  return { require, get: () => view, set, save };
}
*/

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

function saveGame(game: Game | null) {
  if (game) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game.save()));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useLocalGame(): GameContext {
  const [game, setGame] = useReducer((_: Game | null, value: Game | null) => {
    saveGame(value);
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
}: {
  game: Game | null;
  setGame: Dispatch<Game | null>;
  impersonated?: Id;
}) {
  if (!game) return createEmptyContext(setGame);

  return {
    ...localContext,
    create: alreadyRunning,
    stop: wrap(() => setGame(null)),
    game: wrap(() => game.status),
    players: wrap(() => game.players),
    activeEvent: wrap(() => game.events[0]),
    submitVote: wrap((vote: Vote) => {
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it.id, vote);
      });
      saveGame(game);
    }),
    undo: wrap(() => {
      game.undo();
      saveGame(game);
    }),
    redo: wrap(() => {
      game.redo();
      saveGame(game);
    }),
  };
}

interface ExtendedGameContext extends GameContext {
  impersonated?: Id;
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
    saveGame(game);
  }

  function setGame(value: Game | null) {
    game = value;
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
    impersonated,
    impersonate,
  };
}

export function LocalGameProvider(props: Readonly<PropsWithChildren>) {
  const context = useMemo(() => createLocalGame(), []);
  return (
    <ImpersonationProvider value={[context.impersonated, context.impersonate]}>
      <GameProvider {...props} value={context} />
    </ImpersonationProvider>
  );
}
