import { RevealEvent } from "../event/RevealEvent.js";
import { registerStartEvent } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Eye extends Role {
  constructor() {
    super("eye", [RoleGroup.VILLAGER], "👁️");
  }
}

registerStartEvent((players) => {
  const seers = players.filter(hasRole("seer"));
  return players
    .filter(hasRole("eye"))
    .map((it) => new RevealEvent("reveal.eye", [it], seers));
});
