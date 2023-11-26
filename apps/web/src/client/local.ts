import { Game, generateRoles } from "logic";
import { Vote } from "models";
import { GameContext } from "ui";

const STORAGE_KEY = "gamestate";

function readOrCreateGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return Game.read(parsed);
  }

  const players = generateRoles(
    new Array(10).fill(null).map((_, id) => ({
      id,
      name: `Player ${id}`,
      roleData: {},
      status: "alive",
    }))
  );

  return Game.create(players);
}

export function createLocalGame(): GameContext {
  const game = readOrCreateGame();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game.save()));
  }

  return {
    game: async () => game.status,
    activeEvent: async () => game.events[0],
    submitVote: async (vote: Vote) => {
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it.id, vote);
      });
      save();
    },
    undo: async () => {
      game.undo();
      save();
    },
    redo: async () => {
      game.redo();
      save();
    },
  };
}
