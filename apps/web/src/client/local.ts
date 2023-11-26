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

  return {
    create: async () => {
      game = createGame();
      save();
    },
    stop: async () => {
      game = null;
      save();
    },
    game: async () => game?.status ?? null,
    players: async () => requireGame().players,
    roles: async () => allRoles,
    activeEvent: async () => requireGame().events[0],
    submitVote: async (vote: Vote) => {
      const game = requireGame();
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it.id, vote);
      });
      save();
    },
    undo: async () => {
      requireGame().undo();
      save();
    },
    redo: async () => {
      requireGame().redo();
      save();
    },
  };
}
