import { SleepEvents } from "../event/SleepBoundary.js";
import { WitchTrigger } from "../event/WitchTrigger.js";
import { hasRole } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Witch extends Role {
  constructor() {
    super("witch", [RoleGroup.VILLAGER], "🧹");
  }
}

export const registerWitchEvents = (role = "witch") =>
  SleepEvents.register(({ players }) => {
    const witches = players.filter(hasRole(role));
    return witches.map((it) => new WitchTrigger([it]));
  });
/*
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
        players: alive.filter(others(it)),
        canSkip: true,
      }),
    ]);
  });
*/
