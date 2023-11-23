import { KillEvent } from "../event/KillEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { inGroup, isAlive } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Werewolf extends Role {
  constructor() {
    super("werewolf", [RoleGroup.WOLF], "🐺");
  }
}

export const registerWolfEvents = () =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const wolfs = alive.filter(inGroup(RoleGroup.WOLF));
    const targets = alive.filter((it) => !wolfs.includes(it));
    return new KillEvent("kill.wolfs", wolfs, "getting eaten", {
      players: targets,
    });
  });
