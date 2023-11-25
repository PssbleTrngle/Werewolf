import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { Player } from "../player/Player.js";
import { isAlive, isDying, others } from "../player/predicates.js";
import { Event } from "./Event.js";
import PotionKillEvent from "./PotionKillEvent.js";
import PotionReviveEvent from "./PotionReviveEvent.js";

export class WitchTrigger extends Event {
  constructor(readonly players: ReadonlyArray<Player>) {
    super("trigger.witch", players);
  }

  finish(): ArrayOrSingle<Effect> {
    return new EventEffect(({ players }) => {
      const dying = players.filter(isDying);

      const alive = players.filter(isAlive);

      // TODO witches should only be doing this once per round & use this once per game
      // save data to player
      const revive = new PotionReviveEvent(
        "revive.witch",
        this.players.filter((it) => !it.roleData.usedRevivePotion),
        {
          players: dying,
          canSkip: true,
        },
      );

      const kill = new PotionKillEvent(
        "kill.witch",
        this.players.filter((it) => !it.roleData.usedKillPotion),
        "potion",
        {
          players: alive.filter(others(...this.players)),
          canSkip: true,
        },
      );

      if (dying.length === 0) return kill;
      return [revive, kill];
    }, true);
  }

  isFinished(game: GameReadAccess): boolean {
    return game.players.some(isDying);
  }
}
