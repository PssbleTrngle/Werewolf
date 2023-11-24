import { Event, Game, generateRoles } from "logic";
import { Event as IEvent, Vote } from "models";
import { GameContext } from "ui";

function mapEvent(value: Event): IEvent {
  const { type, players, choice, timeLimit, ...data } = value;
  return {
    type,
    timeLimit,
    players,
    choice,
    data,
  };
}

export function createLocalGame(): GameContext {
  const players = generateRoles(
    new Array(10).fill(null).map((_, id) => ({
      id,
      name: `Player ${id}`,
      roleData: {},
      status: "alive",
    }))
  );

  const game = new Game(players);

  return {
    game: async () => game.status,
    activeEvent: async () => mapEvent(game.events[0]),
    submitVote: async (vote: Vote) => {
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it, vote);
      });
    },
    undo: async () => game.undo(),
    redo: async () => game.redo(),
  };
}
