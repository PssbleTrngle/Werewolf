import { SeeEvent } from "../event/SeeEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { hasRole, isAlive, notSelf } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Seer extends Role {
  constructor() {
    super("seer", [RoleGroup.VILLAGER], "🔮");
  }
}

export const registerSeerEvents = (role = "seer") =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return seers.map((it) => new SeeEvent(it, alive.filter(notSelf(it))));
  });
