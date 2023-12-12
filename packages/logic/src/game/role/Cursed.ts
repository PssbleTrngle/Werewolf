import { DeathCause, Role, RoleGroup } from "models";
import { ChangeRoleEffect } from "../effect/ChangeRoleEffect.js";
import { ReviveEffect } from "../effect/ReviveEffect.js";
import { DeathEvents } from "../event/DeathEvent.js";
import { hasRole } from "../player/predicates.js";
import { Werewolf } from "./Wolf.js";

export const Cursed: Role = {
  type: "cursed",
  groups: [RoleGroup.VILLAGER],
  emoji: "🌒",
};

const INFECTING_CAUSES = [DeathCause.WOLFS];

export function registerCursedEvents(role = Cursed, into = Werewolf) {
  DeathEvents.register((subject, cause) => {
    if (!hasRole(role)(subject)) return false;
    if (!INFECTING_CAUSES.includes(cause)) return false;

    return [
      new ReviveEffect(subject.id),
      new ChangeRoleEffect(subject.id, into),
    ];
  });
}
