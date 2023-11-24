import { KillEvent } from "../event/KillEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { inGroup, isNotDead } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Werewolf extends Role {
  constructor() {
    super("werewolf", [RoleGroup.WOLF], "🐺");
  }
}

export const registerWolfEvents = () =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isNotDead);
    const wolfs = alive.filter(inGroup(RoleGroup.WOLF));
    const targets = alive.filter((it) => !wolfs.includes(it));
    return new KillEvent("kill.wolfs", wolfs, "getting eaten", {
      players: targets,
    });
  });
