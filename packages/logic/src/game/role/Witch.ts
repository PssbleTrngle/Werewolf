import { SleepEvents } from "../event/SleepBoundary.js";
import { WitchTrigger } from "../event/WitchTrigger.js";
import { hasRole, isAlive } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Witch extends Role {
  constructor() {
    super("witch", [RoleGroup.VILLAGER], "🧹");
  }
}

export const registerWitchEvents = (role = "witch") =>
  SleepEvents.register(({ players }) => {
    const witches = players.filter(isAlive).filter(hasRole(role));
    return witches.map((it) => WitchTrigger.create([it]));
  });
