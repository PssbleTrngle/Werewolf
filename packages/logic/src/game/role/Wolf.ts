import { DeathCause, Player, PlayerRevealType, Role, RoleGroup } from "models";
import { EventEffect } from "../effect/EventEffect.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { registerEventFactory } from "../event/EventRegistry.js";
import { KillEvent } from "../event/KillEvent.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import revealPlayer from "../permissions/playerReveal.js";
import { hasRole, inGroup, isAlive, others } from "../player/predicates.js";
import { WinConditions } from "../winConditions.js";
import { DreamWolf } from "./DreamWolf.js";
import { LoneWolf } from "./LoneWolf.js";
import { WolfCub } from "./WolfCub.js";

export const Werewolf: Role = {
  type: "werewolf",
  groups: [RoleGroup.WOLF],
  emoji: "🐺",
  impact: -6,
};

const createKillEvent = registerEventFactory(
  "kill.wolfs",
  new KillEvent(),
  (targets: ReadonlyArray<Player>, voteCount: number) => ({
    choice: {
      players: targets,
      voteCount,
    },
    data: {
      cause: DeathCause.WOLFS,
    },
  })
);

export const registerWolfEvents = () =>
  SleepEvents.register(({ players }) => {
    const alive = players.filter(isAlive);
    const deadWolfs = players
      .filter(inGroup(RoleGroup.WOLF))
      .filter((it) => !isAlive(it));

    const wolfs = alive
      .filter(inGroup(RoleGroup.WOLF))
      .filter((it) => deadWolfs.length > 0 || !hasRole(DreamWolf)(it));

    const voteCount = 1 + deadWolfs.filter(hasRole(WolfCub)).length;

    const targets = alive.filter((it) => !wolfs.includes(it));
    return [
      ...wolfs.map(
        (it) =>
          new PlayerDataEffect(it.id, (data) => ({
            revealedPlayers: {
              ...data.revealedPlayers,
              ...Object.fromEntries(
                wolfs
                  .filter(others(it))
                  .map((it) => [
                    it.id,
                    revealPlayer(it, PlayerRevealType.GROUP),
                  ])
              ),
            },
          }))
      ),
      new EventEffect(() => createKillEvent(wolfs, targets, voteCount)),
    ];
  });

export function registerWolfWinCondition(
  group: RoleGroup = RoleGroup.WOLF,
  type: string = "wolfs"
) {
  WinConditions.register(({ players }) => {
    const alive = players.filter(isAlive);
    const wolfs = players.filter(inGroup(group));

    if (wolfs.filter(isAlive).length !== alive.length) return false;

    const winners = wolfs.filter((it) => !hasRole(LoneWolf)(it));
    if (winners.length === 0) return false;

    return {
      type,
      winners,
    };
  });
}
