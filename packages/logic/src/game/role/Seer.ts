import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { SeeEvent } from "../event/SeeEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { hasRole, isAlive, others } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Seer extends Role {
  constructor() {
    super("seer", [RoleGroup.VILLAGER], "🔮");
  }
}

registerEvent("reveal.seer", new RevealEvent());

export const registerSeerEvents = (role = "seer") =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return seers.map((it) => SeeEvent.create([it], alive.filter(others(it))));
  });
