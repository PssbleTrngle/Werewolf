import { Id, Player, Role, RoleGroup } from "models";
import { arrayOrSelf } from "../../util.js";
import { generateRoles } from "../RoleSelector.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { EventFactory } from "../event/Event.js";
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

function seerSleepFactory(role: string): EventFactory {
  return ({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return seers.map((it) => SeeEvent.create([it], alive.filter(others(it))));
  };
}

function foolSleepFactory(role: string): EventFactory {
  return ({ players }) => {
    const alive = players.filter(isAlive);
    const fools = alive.filter(hasRole(role));
    return fools.map((it) =>
      HallucinateEvent.create([it], alive.filter(others(it)))
    );
  };
}

export const registerSeerEvents = (
  seer = Seer.type,
  fool: string | undefined = Fool.type
) => {
  registerEvent(`reveal.${seer}`, new RevealEvent());

  const seerEvents = seerSleepFactory(seer);
  const foolEvents = fool ? foolSleepFactory(fool) : () => [];

  if (fool) {
    StartEvents.register(({ players }) => {
      const fools = players.filter(hasRole(fool));
      return fools.map((it) => {
        const hallucinatedRoles: Record<Id, Partial<Player>> = {};
        const otherPlayers = players.filter(others(it));
        // TODO use all possible roles allowed by the rule set
        const roles = generateRoles(otherPlayers).map(({ role }) => ({ role }));
        otherPlayers.forEach(({ id }, i) => (hallucinatedRoles[id] = roles[i]));
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
