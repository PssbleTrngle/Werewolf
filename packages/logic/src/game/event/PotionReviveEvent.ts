import { Vote } from "models";
import { ArrayOrSingle, arrayOrSelf } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { ReviveEvent } from "./ReviveEvent.js";

export default class PotionReviveEvent extends ReviveEvent {
  finish(vote: Vote): ArrayOrSingle<Effect> {
    const parentEffects = arrayOrSelf(super.finish(vote));
    if (vote.type === "skip") return parentEffects;
    return [
      ...parentEffects,
      ...this.players.map(
        (it) => new PlayerDataEffect(it.id, { usedRevivePotion: true })
      ),
    ];
  }
}
