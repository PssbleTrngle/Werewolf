import { Role, RoleGroup } from "models";
import { WinConditions } from "../winConditions.js";
import { hasRole, isAlive } from "../player/predicates.js";

export const LoneWolf: Role = {
  type: "lone_wolf",
  groups: [RoleGroup.WOLF],
  emoji: "🌑",
};

export function registerLoneWolfWinCondition(role = LoneWolf) {
  WinConditions.register(({ players }) => {
    const alive = players.filter(isAlive);

    if (alive.length > 1) return false;
    if (!hasRole(role)(alive[0])) return false;

    return {
      type: role.type,
      winners: alive,
    };
  });
}
