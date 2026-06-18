import { DeathCause } from "models";
import { ChangeRoleEffect } from "../../effect/ChangeRoleEffect.js";
import { ReviveEffect } from "../../effect/ReviveEffect.js";
import { DeathEvents } from "../../event/DeathEvent.js";
import { hasRole } from "../../player/predicates.js";
import { Werewolf } from "../wolf/index.js";
import { Cursed } from "./index.js";

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
