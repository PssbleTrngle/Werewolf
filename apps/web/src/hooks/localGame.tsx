import {
  Game,
  GameState,
  GameView,
  ModeratorGameView,
  allRoles,
  generateRoles,
} from "logic";
import { Player, Vote } from "models";
import { PropsWithChildren, useMemo } from "react";
import { GameContext, GameProvider } from "ui";
import useImpersonation from "./impersonate";
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

export function useLocalGame(): GameContext {
  const [impersonanted, impersonate] = useImpersonation();

  const game = useMemo(createState, []);

  return useMemo<GameContext>(
    () => ({
      create: wrap(() => {
        game.set(createGame());
      }),
      stop: wrap(() => {
        game.set(null);
      }),
      game: wrap(() => game.get()?.status() ?? null),
      players: wrap(() => game.require().players()),
      roles: wrap(() => allRoles),
      activeEvent: wrap(() => game.require().events()[0]),
      submitVote: wrap((vote: Vote) => {
        game.require().vote(vote);
        game.save();
      }),
      undo: wrap(() => {
        game.require().undo();
        game.save();
      }),
      redo: wrap(() => {
        game.require().redo();
        game.save();
      }),
    }),
    [game]
  );
}

export function LocalGameProvider(props: Readonly<PropsWithChildren>) {
  const context = useLocalGame();
  return <GameProvider {...props} value={context} />;
}
