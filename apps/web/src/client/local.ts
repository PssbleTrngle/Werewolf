import { Game, GameState, allRoles, generateRoles } from "logic";
import { Player, Vote } from "models";
import { GameContext } from "ui";
import { readLocalStorage } from "../hooks/useLocalStorage";

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

export function createLocalGame(): GameContext {
  let game = readSavedGame();

  function save() {
    if (game) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game.save()));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function requireGame() {
    if (!game) throw new Error("No game active");
    return game;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrap<T extends (...args: any[]) => any>(func: T) {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        return func(...args);
      } catch (e) {
        if (e instanceof Error) {
          /* eslint-disable no-console */
          console.error("an error occured in the logic package");
          console.error(e.message);
          /* eslint-enable no-console */
        }
        throw e;
      }
    };
  }

  return {
    create: wrap(() => {
      game = createGame();
      save();
    }),
    stop: wrap(() => {
      game = null;
      save();
    }),
    game: wrap(() => game?.status ?? null),
    players: wrap(() => requireGame().players),
    roles: wrap(() => allRoles),
    activeEvent: wrap(() => requireGame().events[0]),
    submitVote: wrap((vote: Vote) => {
      const game = requireGame();
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it.id, vote);
      });
      save();
    }),
    undo: wrap(() => {
      requireGame().undo();
      save();
    }),
    redo: wrap(() => {
      requireGame().redo();
      save();
    }),
  };
}
