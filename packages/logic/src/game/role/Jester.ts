import { DeathCause, Role } from "models";
import { hasRole } from "../player/predicates.js";
import { WinConditions } from "../winConditions.js";

export const Jester: Role = {
  type: "jester",
  groups: [],
  emoji: "🃏",
  impact: 1,
};

export function registerJesterWinCondition(role: string = Jester.type) {
  WinConditions.register(({ players }) => {
    const jesters = players.filter(hasRole(role));
    const lynched = jesters.filter(
      (it) => it.deathCause === DeathCause.LYNCHED,
    );

    if (lynched.length === 0) return false;

    return {
      type: role,
      winners: lynched,
    };
  });
}
