import { KillEvent } from "../event/KillEvent";
import { registerSleepEvent } from "../event/SleepBoundary";
import { inGroup, isAlive } from "../player/predicates";
import { Role } from "./Role";
import { RoleGroup } from "./RoleGroup";

export class Werewolf extends Role {
  constructor() {
    super([RoleGroup.WOLF], "🐺");
  }
}

registerSleepEvent((players) => {
  const alive = players.filter(isAlive);
  const wolfs = alive.filter(inGroup(RoleGroup.WOLF));
  const targets = alive.filter((it) => !wolfs.includes(it));
  return new KillEvent(wolfs, "getting eaten", { players: targets });
});
