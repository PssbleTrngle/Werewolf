import { RoleGroup } from "models";
import { inGroup, isAlive } from "../../player/predicates.js";
import { WinConditions } from "../../winConditions.js";

export function registerVillagerWinCondition() {
  WinConditions.register(({ players }) => {
    const alive = players.filter(isAlive);
    // TODO may be other roles too in the future
    const evil = alive.filter(inGroup(RoleGroup.WOLF));

    if (evil.length > 0) return false;

    const villagers = players.filter(inGroup(RoleGroup.VILLAGER));

    return {
      type: "villagers",
      winners: villagers,
    };
  });
}
