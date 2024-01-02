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
  impact: 3,
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
  }),
);

const VALID_DEATH_CAUSES = [DeathCause.WOLFS];

export const registerHunterEvents = (role = Hunter.type) =>
  DeathEvents.register((self, cause) => {
    if (self.role.type !== role) return false;

    if (!VALID_DEATH_CAUSES.includes(cause)) return false;

    return new EventEffect(({ players }) => {
      const targets = players.filter(isNotDead).filter(others(self));
      return createKillEvent([self], targets);
    }, true);
  });
