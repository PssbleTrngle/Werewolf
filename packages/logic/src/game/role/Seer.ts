import { Id, Player, Role, RoleGroup } from "models";
import { arrayOrSelf } from "../../util.js";
import { InitialDataEvents, generateRoles } from "../RoleSelector.js";
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
import { hasRole, isAlive, others } from "../player/predicates.js";

export const Seer: Role = {
  type: "seer",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔮",
  variants: ["male", "female"],
  impact: 7,
};

export const Fool: Role = {
  type: "fool",
  groups: [RoleGroup.VILLAGER],
  emoji: "🤡",
  impact: -2,
};

function seerSleepFactory(role: Role): EventFactory {
  return roleScopedFactory(role, ({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return individualEvents(seers, (it) =>
      SeeEvent.create(it, it[0]?.role ?? role, alive.filter(others(...it)))
    );
  });
}

function foolSleepFactory(role: Role, disguiseAs: Role): EventFactory {
  return roleScopedFactory(disguiseAs, ({ players }) => {
    const alive = players.filter(isAlive);
    const fools = alive.filter(hasRole(role));
    return individualEvents(fools, (it) =>
      HallucinateEvent.create(
        it,
        it[0]?.roleData?.hallucinated?.[it[0].id]?.role ?? disguiseAs,
        alive.filter(others(...it))
      )
    );
  });
}

export const registerSeerEvents = (
  seer = Seer,
  fool: Role | undefined = Fool
) => {
  registerEvent(`reveal.${seer.type}`, new RevealEvent());

  const seerEvents = seerSleepFactory(seer);
  const foolEvents = fool ? foolSleepFactory(fool, seer) : () => [];

  if (fool) {
    InitialDataEvents.register((it, others, settings) => {
      if (!hasRole(fool)(it)) return false;

      const seers = others.filter(hasRole(seer));
      const takenVariants = seers.map((it) => it.role.variant);
      const variant = Seer.variants?.find((it) => !takenVariants.includes(it));

      const hallucinatedRoles: Record<Id, Partial<Player>> = {
        [it.id]: { role: { ...Seer, variant } },
      };

      const roles = generateRoles([it, ...others], {
        ...settings,
        disabledRoles: [...settings.disabledRoles, seer.type, fool.type],
      }).map(({ role }) => ({ role }));

      others.forEach(({ id }, i) => (hallucinatedRoles[id] = roles[i]));
      seers.forEach(({ id }) => (hallucinatedRoles[id] = { role: fool }));

      return { hallucinated: hallucinatedRoles };
    });
  }

  SleepEvents.registerEvent((game) => {
    const factories = [seerEvents, foolEvents];

    // TODO predetermine
    if (Math.random() > 0.5) factories.reverse();

    return factories.flatMap((it) => arrayOrSelf(it(game)));
  });
};
