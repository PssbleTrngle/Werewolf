import { WinState } from "models";
import { isAlive } from "./player/predicates.js";
import { GameReadAccess } from "./state.js";

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
