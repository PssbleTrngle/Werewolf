import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { isAlive, isDying, others } from "../player/predicates.js";
import { EventType } from "./Event.js";
import { registerEventFactory } from "./EventRegistry.js";
import PotionKillEvent from "./PotionKillEvent.js";
import PotionReviveEvent from "./PotionReviveEvent.js";

export class WitchTrigger extends EventType {
  static create = registerEventFactory(
    "trigger.witch",
    new WitchTrigger(),
    () => ({
      data: undefined,
    })
  );

  finish(_vote: Vote, event: Event): ArrayOrSingle<Effect> {
    return new EventEffect((game) => {
      const dying = game.players.filter(isDying);

      const alive = game.players.filter(isAlive);

      const users = event.players.map((it) => game.playerById(it.id));

      const revive = PotionReviveEvent.create(
        users.filter((it) => !it.roleData.usedRevivePotion),
        dying
      );

      const kill = PotionKillEvent.create(
        users.filter((it) => !it.roleData.usedKillPotion),
        alive.filter(others(...users))
      );

      if (dying.length === 0) return kill;
      return [revive, kill];
    }, true);
  }

  isFinished(game: GameReadAccess): boolean {
    return game.players.some(isDying);
  }
}
