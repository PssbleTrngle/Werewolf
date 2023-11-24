import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { Player } from "../player/Player.js";
import { isAlive, others } from "../player/predicates.js";
import { Event } from "./Event.js";
import { KillEvent } from "./KillEvent.js";
import { ReviveEvent } from "./ReviveEvent.js";

export class WitchTrigger extends Event {
  constructor(readonly players: ReadonlyArray<Player>) {
    super("trigger.witch", players);
  }

  finish(): ArrayOrSingle<Effect> {
    return new EventEffect(({ players, unnotifiedDeaths }) => {
      const brinkOfDeath = players.filter((it) =>
        unnotifiedDeaths.includes(it.id)
      );

      const alive = players
        .filter(isAlive)
        .filter((it) => !brinkOfDeath.includes(it));

      // TODO witches should only be doing this once per round & use this once per game
      // save data to player
      const revive = new ReviveEvent("revive.witch", this.players, {
        players: brinkOfDeath,
        canSkip: true,
      });

      const kill = new KillEvent("kill.witch", this.players, "potion", {
        players: alive.filter(others(...this.players)),
        canSkip: true,
      });

      if (brinkOfDeath.length === 0) return kill;
      return [revive, kill];
    }, true);
  }

  isFinished(game: GameReadAccess): boolean {
    return game.unnotifiedDeaths.length > 0;
  }
}
