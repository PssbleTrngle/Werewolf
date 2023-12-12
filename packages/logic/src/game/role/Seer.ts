import { Id, Player, Role, RoleGroup } from "models";
import { arrayOrSelf } from "../../util.js";
import { generateRoles } from "../RoleSelector.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import {
  EventFactory,
  individualEvents,
  roleScopedFactory,
} from "../event/Event.js";
import { registerEvent } from "../event/EventRegistry.js";
import { HallucinateEvent } from "../event/HallucinateEvent.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { SeeEvent } from "../event/SeeEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole, isAlive, others } from "../player/predicates.js";

export const Seer: Role = {
  type: "seer",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔮",
};

export const Fool: Role = {
  type: "fool",
  groups: [RoleGroup.VILLAGER],
  emoji: "🤡",
};

function seerSleepFactory(role: Role): EventFactory {
  return roleScopedFactory(role, ({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return individualEvents(seers, (it) =>
      SeeEvent.create(it, alive.filter(others(...it)))
    );
  });
}

function foolSleepFactory(role: Role): EventFactory {
  return roleScopedFactory(role, ({ players }) => {
    const alive = players.filter(isAlive);
    const fools = alive.filter(hasRole(role));
    return individualEvents(fools, (it) =>
      HallucinateEvent.create(it, alive.filter(others(...it)))
    );
  });
}

export const registerSeerEvents = (
  seer = Seer,
  fool: Role | undefined = Fool
) => {
  registerEvent(`reveal.${seer.type}`, new RevealEvent());

  const seerEvents = seerSleepFactory(seer);
  const foolEvents = fool ? foolSleepFactory(fool) : () => [];

  if (fool) {
    StartEvents.register(({ players }) => {
      const fools = players.filter(hasRole(fool));
      return fools.map((it) => {
        const hallucinatedRoles: Record<Id, Partial<Player>> = {
          [it.id]: { role: Seer },
        };
        // TODO use all possible roles allowed by the rule set
        const roles = generateRoles(players).map(({ role }) => ({ role }));
        players
          .filter(others(it))
          .forEach(({ id }, i) => (hallucinatedRoles[id] = roles[i]));

        return new PlayerDataEffect(it.id, { hallucinated: hallucinatedRoles });
      });
    });
  }

  SleepEvents.registerEvent((game) => {
    const factories = [seerEvents, foolEvents];

    // TODO predetermine
    if (Math.random() > 0.5) factories.reverse();

    return factories.flatMap((it) => arrayOrSelf(it(game)));
  });
};
