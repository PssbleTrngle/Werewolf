import { SeeEvent } from "../event/SeeEvent.js";
import { registerSleepEvent } from "../event/SleepBoundary.js";
import { hasRole, isAlive } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Seer extends Role {
  constructor() {
    super([RoleGroup.VILLAGER], "🔮");
  }
}

registerSleepEvent((players) => {
  const seers = players.filter(hasRole(Seer));
  const alive = players.filter(isAlive);
  return seers.map((it) => new SeeEvent(it, alive));
});
