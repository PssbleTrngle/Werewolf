import { DeathCause, Player } from "models";
import { EventEffect } from "../effect/EventEffect.js";
import { DeathEvents } from "../event/DeathEvent.js";
import { registerEventFactory } from "../event/EventRegistry.js";
import { KillEvent } from "../event/KillEvent.js";
import { isNotDead, others } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Hunter extends Role {
  constructor() {
    super("hunter", [RoleGroup.VILLAGER], "🔫");
  }

  /*
  onDeath(self: Player) {
    return new EventEffect(({ players }) => {
      const targets = players.filter(isNotDead).filter(others(self));
      return new KillEvent("kill.hunter", [self], DeathCause.HUNTER, {
        players: targets,
      });
    }, true);
  }
  */
}

const createKillEvent = registerEventFactory(
  "kill.hunter",
  new KillEvent(),
  (targets: ReadonlyArray<Player>) => ({
    choice: {
      players: targets,
    },
    data: {
      cause: DeathCause.HUNTER,
    },
  })
);

DeathEvents.register((self) => {
  if (self.role.type !== "hunter") return false;
  // TODO self context
  return new EventEffect(({ players }) => {
    const targets = players.filter(isNotDead).filter(others(self));
    return createKillEvent([self], targets);
  }, true);
});
