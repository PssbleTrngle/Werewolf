import { hasRole, isAlive } from "../../player/predicates.js";
import { WinConditions } from "../../winConditions.js";
import { LoneWolf } from "./index.js";

export function registerLoneWolfWinCondition(role = LoneWolf) {
  WinConditions.register(({ players }) => {
    const alive = players.filter(isAlive);

    if (alive.length > 1) return false;
    const [last] = alive;
    if (!last) return false;
    if (!hasRole(role)(last)) return false;

    return {
      type: role.type,
      winners: alive,
    };
  });
}
