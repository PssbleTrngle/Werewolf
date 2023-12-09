import { Role, RoleGroup } from "models";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";

export const Eye: Role = {
  type: "eye",
  groups: [RoleGroup.VILLAGER],
  emoji: "👁️",
};

export const registerEyeEvents = (role = "eye", revealedRole = "seer") => {
  registerEvent(`reveal.${role}`, new RevealEvent());
  StartEvents.registerEvent(({ players }) => {
    const seers = players.filter(hasRole(revealedRole));
    return players
      .filter(hasRole(role))
      .map((it) => RevealEvent.create("eye", [it], seers));
  });
};
