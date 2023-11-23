import { DeathEvents } from "../event/DeathEvent.js";
import { KillEvent } from "../event/KillEvent.js";
import { ReviveEvent } from "../event/ReviveEvent.js";
import { hasRole, isAlive, notSelf } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Witch extends Role {
  constructor() {
    super("witch", [RoleGroup.VILLAGER], "🧹");
  }
}

export const registerWitchEvents = (role = "witch") =>
  DeathEvents.register(({ players, unnotifiedDeaths }) => {
    const witches = players.filter(hasRole(role));
    const brinkOfDeath = players.filter((it) =>
      unnotifiedDeaths.includes(it.id)
    );

    const alive = players
      .filter(isAlive)
      .filter((it) => !brinkOfDeath.includes(it));

    // TODO witches should only be doing this once per round & use this once per game
    // save data to player
    return witches.flatMap((it) => [
      new ReviveEvent("revive.witch", [it], {
        players: brinkOfDeath,
        canSkip: true,
      }),
      // this should probably be a sleep event instead
      new KillEvent("kill.witch", [it], "potion", {
        players: alive.filter(notSelf(it)),
        canSkip: true,
      }),
    ]);
  });
