import { SeeEvent } from "../event/SeeEvent.js";
import { registerSleepEvent } from "../event/SleepBoundary.js";
import { hasRole, isAlive, notSelf } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Seer extends Role {
  constructor() {
    super("seer", [RoleGroup.VILLAGER], "🔮");
  }
}

registerSleepEvent((players) => {
  const seers = players.filter(hasRole("seer"));
  const alive = players.filter(isAlive);
  return seers.map((it) => new SeeEvent(it, alive.filter(notSelf(it))));
});
