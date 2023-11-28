import { Role, RoleGroup } from "models";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { SeeEvent } from "../event/SeeEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { hasRole, isAlive, others } from "../player/predicates.js";

export const Seer: Role = {
  type: "seer",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔮",
};

registerEvent("reveal.seer", new RevealEvent());

export const registerSeerEvents = (role = Seer.type) =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const seers = alive.filter(hasRole(role));
    return seers.map((it) => SeeEvent.create([it], alive.filter(others(it))));
  });
