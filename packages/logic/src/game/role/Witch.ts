import { Role, RoleGroup } from "models";
import { SleepEvents } from "../event/SleepBoundary.js";
import { WitchTrigger } from "../event/WitchTrigger.js";
import { hasRole, isAlive } from "../player/predicates.js";

export const Witch: Role = {
  type: "witch",
  groups: [RoleGroup.VILLAGER],
  emoji: "🧹",
};

export const registerWitchEvents = (role = "witch") =>
  SleepEvents.register(({ players }) => {
    const witches = players.filter(isAlive).filter(hasRole(role));
    return witches.map((it) => WitchTrigger.create([it]));
  });
