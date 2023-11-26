import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Eye extends Role {
  constructor() {
    super("eye", [RoleGroup.VILLAGER], "👁️");
  }
}

export const registerEyeEvents = (role = "eye", revealedRole = "seer") =>
  StartEvents.register(({ players }) => {
    const seers = players.filter(hasRole(revealedRole));
    return players
      .filter(hasRole(role))
      .map((it) => RevealEvent.create("eye", [it], seers));
  });
