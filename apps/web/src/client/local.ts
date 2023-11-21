import { Event, Game, generateRoles } from "logic";
import { Event as IEvent, Vote } from "models";
import { GameContext } from "../hooks/game";

function mapEvent(value: Event): IEvent {
  const { type, players, choice, ...data } = value;
  return {
    type,
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
      status: "alive",
    }))
  );

  const game = new Game(players);

  return {
    activeEvent: async () => mapEvent(game.events[0]),
    submitVote: async (vote: Vote) => {
      const event = game.events[0];
      event.players.forEach((it) => {
        game.vote(it, vote);
      });
    },
  };
}
