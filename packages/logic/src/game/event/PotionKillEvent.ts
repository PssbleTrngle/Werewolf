import { DeathCause, Event, KillData, Player, Vote } from "models";
import { arrayOrSelf } from "../../util.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { registerEventFactory } from "./EventRegistry.js";
import { KillEvent } from "./KillEvent.js";

export default class PotionKillEvent extends KillEvent {
  static create = registerEventFactory(
    "kill.witch",
    new PotionKillEvent(),
    (targets: ReadonlyArray<Player>) => ({
      type: "kill.witch",
      choice: {
        players: targets,
        canSkip: true,
      },
      data: {
        cause: DeathCause.POTION,
      },
    })
  );

  finish(vote: Vote, event: Event<KillData>) {
    const parentEffects = arrayOrSelf(super.finish(vote, event));
    if (vote.type === "skip") return parentEffects;
    return [
      ...parentEffects,
      ...event.players.map(
        (it) => new PlayerDataEffect(it.id, { usedKillPotion: true })
      ),
    ];
  }
}
