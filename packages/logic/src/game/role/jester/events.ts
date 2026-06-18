import { DeathCause } from "models";
import { hasRole } from "../../player/predicates.js";
import { WinConditions } from "../../winConditions.js";
import { Jester } from "./index.js";

export function registerJesterWinCondition(role = Jester) {
  WinConditions.register(({ players }) => {
    const jesters = players.filter(hasRole(role));
    const lynched = jesters.filter(
      (it) => it.deathCause === DeathCause.LYNCHED,
    );

    if (lynched.length === 0) return false;

    return {
      type: role.type,
      winners: lynched,
    };
  });
}
