import { times } from "lodash-es";
import { WinData } from "models";
import {
  Executioner,
  Jester,
  requirePlayer,
  Villager,
  Werewolf,
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
  it("wins when their target gets lynched", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    const target = requireTarget(game);
    const otherVillagers = villagers.filter((it) => it !== target);

    game.expectCurrentEvent("reveal.executioner");
    await game.vote(executioner, skipVote());

    await game.vote(wolf, playerVote(otherVillagers[0]));

    await game.dismiss();

    game.expectEvents("kill.lynch");

    await game.vote(target, playerVote(target));
    await game.vote(otherVillagers.slice(1), playerVote(target));

    await game.vote(executioner, skipVote());
    await game.vote(wolf, skipVote());

    expectExecutionerWin(game);
  });

  it("turns into a jester when the target dies without being lynched", async () => {
    const game = TestGame.create(players);

    await game.dismiss();
    await game.vote(executioner, skipVote());

    const target = requireTarget(game);

    await game.vote(wolf, playerVote(target));

    game.expectEvents("announcement.death", "kill.lynch");

    await game.dismiss();

    expect(requirePlayer(game.players, executioner).role).toBe(Jester);
  });
});
