import { DeathCause, Player, Role, RoleGroup } from "models";
import { EventEffect } from "../effect/EventEffect.js";
import { DeathEvents } from "../event/DeathEvent.js";
import { registerEventFactory } from "../event/EventRegistry.js";
import { KillEvent } from "../event/KillEvent.js";
import { isNotDead, others } from "../player/predicates.js";

export const Hunter: Role = {
  type: "hunter",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔫",
};

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

export const registerHunterEvents = (role = Hunter.type) =>
  DeathEvents.register((self) => {
    if (self.role.type !== role) return false;
    // TODO self context
    return new EventEffect(({ players }) => {
      const targets = players.filter(isNotDead).filter(others(self));
      return createKillEvent([self], targets);
    }, true);
  });
