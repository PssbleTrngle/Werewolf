import { DeathCause, WinState } from "models";
import { GameReadAccess } from "./Game.js";
import { hasRole, inGroup, isAlive } from "./player/predicates.js";
import { RoleGroup } from "./role/RoleGroup.js";

type WinConditionChecker = (game: GameReadAccess) => WinState | false;

const checkers: WinConditionChecker[] = [];

export const WinConditions = {
  register(checker: WinConditionChecker) {
    checkers.push(checker);
  },
};

function isWinState(input: WinState | false): input is WinState {
  return input !== false;
}

export function testWinConditions(game: GameReadAccess) {
  return checkers.map((check) => check(game)).find(isWinState);
}

WinConditions.register(({ players }) => {
  const alive = players.filter(isAlive);

  if (alive.length > 0) return false;

  return {
    type: "none",
    winners: [],
  };
});

WinConditions.register(({ players }) => {
  const alive = players.filter(isAlive);
  const wolfs = players.filter(inGroup(RoleGroup.WOLF));

  if (wolfs.filter(isAlive).length !== alive.length) return false;

  return {
    type: "wolfs",
    winners: wolfs,
  };
});

WinConditions.register(({ players }) => {
  const alive = players.filter(isAlive);
  const wolfs = alive.filter(inGroup(RoleGroup.WOLF));

  if (wolfs.length > 0) return false;

  const villagers = players.filter(inGroup(RoleGroup.VILLAGER));

  return {
    type: "villagers",
    winners: villagers,
  };
});

WinConditions.register(({ players }) => {
  const jesters = players.filter(hasRole("jester"));
  const lynched = jesters.filter((it) => it.deathCause === DeathCause.LYNCHED);

  if (lynched.length === 0) return false;

  return {
    type: "jester",
    winners: lynched,
  };
});
