import type { Player } from "models";
import { DeathCause } from "models";
import { EventEffect } from "../../effect/EventEffect.js";
import { DeathEvents } from "../../event/DeathEvent.js";
import { registerEventFactory } from "../../event/EventRegistry.js";
import { KillEvent } from "../../event/KillEvent.js";
import { isNotDead, others } from "../../player/predicates.js";
import { Hunter } from "./index.js";

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

export const registerHunterEvents = (role = Hunter) =>
  DeathEvents.register((self, cause) => {
    if (self.role.type !== role.type) return false;

    if (!VALID_DEATH_CAUSES.includes(cause)) return false;

    return new EventEffect(({ players }) => {
      const targets = players.filter(isNotDead).filter(others(self));
      return createKillEvent([self], targets);
    }, true);
  });
