import { DeathCause, Player, Role, RoleGroup } from "models";
import { registerEventFactory } from "../event/EventRegistry.js";
import { KillEvent } from "../event/KillEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import { inGroup, isAlive } from "../player/predicates.js";

export const Werewolf: Role = {
  type: "werewolf",
  groups: [RoleGroup.WOLF],
  emoji: "🐺",
};

const createKillEvent = registerEventFactory(
  "kill.wolfs",
  new KillEvent(),
  (targets: ReadonlyArray<Player>) => ({
    choice: {
      players: targets,
    },
    data: {
      cause: DeathCause.WOLFS,
    },
  })
);

export const registerWolfEvents = () =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const hasWolfDied = players
      .filter(inGroup(RoleGroup.WOLF))
      .some((it) => !isAlive(it));

    const wolfs = alive
      .filter(inGroup(RoleGroup.WOLF))
      .filter((it) => hasWolfDied || it.role.type !== "dreamwolf");

    const targets = alive.filter((it) => !wolfs.includes(it));
    return createKillEvent(wolfs, targets);
  });
