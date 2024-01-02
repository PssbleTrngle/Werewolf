import { Vote } from "models";
import { Player } from "../player/Player.js";
import { registerEventFactory } from "./EventRegistry.js";
import { NoDataEvent } from "./NoDataEvent.js";
import { RevealEvent } from "./RevealEvent.js";
import { EventEffect } from "../effect/EventEffect.js";
import { requirePlayer } from "../player/predicates.js";
import revealPlayer from "../permissions/playerReveal.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";

export default class AmorEvent extends NoDataEvent {
  static create = registerEventFactory(
    "amor",
    new AmorEvent(),
    (choices: ReadonlyArray<Player>) => ({
      choice: {
        players: choices,
        voteCount: 2,
      },
      data: null as never,
    }),
  );

  finish(vote: Vote) {
    if (vote.type === "skip") return [];
    if (vote.players.length !== 2)
      throw new Error("invalid amor selection, no polygamy allowed");

    return [
      new EventEffect(({ players, settings }) => {
        const couple = vote.players.map((id) => requirePlayer(players, id));
        return RevealEvent.create(
          "love",
          couple,
          couple.map((it) => revealPlayer(it, settings.loveRevealType)),
        );
      }, true),
      ...vote.players.map(
        (id) =>
          new PlayerDataEffect(id, {
            loves: vote.players.find((it) => it !== id),
          }),
      ),
    ];
  }
}
