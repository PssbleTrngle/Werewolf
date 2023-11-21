import { RevealEvent } from "../event/RevealEvent.js";
import { registerStartEvent } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";
import { Seer } from "./Seer.js";

export class Eye extends Role {
  constructor() {
    super([RoleGroup.VILLAGER], "👁️");
  }
}

registerStartEvent((players) => {
  const seers = players.filter(hasRole(Seer));
  return players.filter(hasRole(Eye)).map((it) => new RevealEvent([it], seers));
});
