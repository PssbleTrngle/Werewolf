import { Event, Vote } from "models";
import { Player } from "../player/Player.js";
import { registerEventFactory } from "./EventRegistry.js";
import { NoDataEvent } from "./NoDataEvent.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";

export default class GuardEvent extends NoDataEvent {
  static create = registerEventFactory(
    "guard",
    new GuardEvent(),
    (choices: ReadonlyArray<Player>) => ({
      choice: {
        players: choices,
      },
      data: null as never,
    }),
  );

  finish(vote: Vote, event: Event<never>) {
    if (vote.type === "skip") return [];

    const [target] = vote.players;

    return event.players.map(
      ({ id }) => new PlayerDataEffect(id, { guarding: target }),
    );
  }
}
