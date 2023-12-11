import { times } from "lodash-es";
import { WinData } from "models";
import {
  Executioner,
  Jester,
  Villager,
  Werewolf,
  requirePlayer,
} from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayersWith([
  Executioner,
  Werewolf,
  ...times(5, () => Villager),
]);
const [executioner, wolf, ...villagers] = players.map((it) => it.id);

function expectExecutionerWin(game: TestGame) {
  game.expectEvents("announcement.death", "win");
  expect(game.events[1].data).toMatchObject<WinData>({
    state: {
      type: Executioner.type,
      winners: [game.players[0]],
    },
  });
}

function requireTarget(game: TestGame) {
  const target = requirePlayer(game.players, executioner)?.roleData?.target;

  expect(target).not.toBeUndefined();
  assert(target);

  return target;
}

describe("tests regarding the executioner", () => {
  it("wins when they get lynched", () => {
    const game = TestGame.create(players);

    game.dismiss();

    const target = requireTarget(game);

    game.expectCurrentEvent("reveal.executioner");
    game.vote(executioner, skipVote());

    game.vote(wolf, playerVote(villagers[0]));

    game.dismiss();

    game.expectEvents("kill.lynch");

    villagers.slice(1).forEach((it) => game.vote(it, playerVote(target)));

    game.vote(executioner, skipVote());
    game.vote(wolf, skipVote());

    expectExecutionerWin(game);
  });

  it("turns into a jester when the target dies without beeing lynched", () => {
    const game = TestGame.create(players);

    game.dismiss();
    game.vote(executioner, skipVote());

    const target = requireTarget(game);

    game.vote(wolf, playerVote(target));

    game.expectEvents("announcement.death", "kill.lynch");

    game.dismiss();

    expect(requirePlayer(game.players, executioner).role).toBe(Jester);
  });
});
