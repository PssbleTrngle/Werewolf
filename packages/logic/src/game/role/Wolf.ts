import { KillEvent } from '../event/KillEvent.js';
import { registerSleepEvent } from '../event/SleepBoundary.js';
import { inGroup, isAlive } from '../player/predicates.js';
import { Role } from './Role.js';
import { RoleGroup } from './RoleGroup.js';

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
