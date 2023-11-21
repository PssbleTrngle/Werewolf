import { Event, Game, Player, Role, generateRoles } from "logic";
import {
  Event as IEvent,
  Player as IPlayer,
  Role as IRole,
  Vote,
} from "models";
import { GameContext } from "../hooks/game";

function mapRole(value: Role): IRole {
  return {
    ...value,
    type: value.constructor.name,
  };
}

function mapPlayer(value: Player): IPlayer {
  return {
    ...value,
    role: mapRole(value.role),
  };
}

function mapEvent(value: Event): IEvent {
  const { players, choice, ...data } = value;
  return {
    type: value.constructor.name,
    players: players.map(mapPlayer),
    choice: {
      ...choice,
      players: choice?.players.map(mapPlayer),
    },
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
