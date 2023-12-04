import { Event, Player, Vote } from "models";
import { ArrayOrSingle, arrayOrSelf } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { registerEventFactory } from "./EventRegistry.js";
import { ReviveEvent } from "./ReviveEvent.js";

export default class PotionReviveEvent extends ReviveEvent {
  static create = registerEventFactory(
    "revive.witch",
    new PotionReviveEvent(),
    (dying: ReadonlyArray<Player>) => ({
      choice: {
        players: dying,
        canSkip: true,
      },
      data: null,
    })
  );

  finish(vote: Vote, event: Event<undefined>): ArrayOrSingle<Effect> {
    const parentEffects = arrayOrSelf(super.finish(vote, event));
    if (vote.type === "skip") return parentEffects;
    return [
      ...parentEffects,
      ...event.players.map(
        (it) => new PlayerDataEffect(it.id, { usedRevivePotion: true })
      ),
    ];
  }
}
