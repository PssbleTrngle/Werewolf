import { KillEvent } from "../event/KillEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { inGroup, isAlive, isNotDead } from "../player/predicates.js";
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
    const hasWolfDied = players
      .filter(inGroup(RoleGroup.WOLF))
      .some((it) => !isAlive(it));

    const wolfs = alive
      .filter(inGroup(RoleGroup.WOLF))
      .filter((it) => hasWolfDied || it.role.type !== "dreamwolf");

    const targets = alive.filter((it) => !wolfs.includes(it));
    return new KillEvent("kill.wolfs", wolfs, "getting eaten", {
      players: targets,
    });
  });
