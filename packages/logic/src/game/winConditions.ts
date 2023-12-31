import { WinState } from "models";
import { isAlive, requirePlayer } from "./player/predicates.js";
import { GameReadAccess } from "./state.js";
import { notNull } from '../util.js';
import { uniqBy } from "lodash-es";

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

function modifyWinState(input: WinState, game: GameReadAccess): WinState {
  const winningLovers = input.winners.flatMap(({ id }) => {
    const { roleData } = requirePlayer(game.players, id);
    if (notNull(roleData.loves))
      return [requirePlayer(game.players, roleData.loves)];
    return [];
  });

  return {
    ...input,
    winners: uniqBy([...input.winners, ...winningLovers], (it) => it.id),
  };
}

export function testWinConditions(game: GameReadAccess) {
  const raw = checkers.map((check) => check(game)).find(isWinState);
  return raw && modifyWinState(raw, game);
}

WinConditions.register(({ players }) => {
  const alive = players.filter(isAlive);

  if (alive.length > 0) return false;

  return {
    type: "none",
    winners: [],
  };
});
