import { times } from "lodash-es";
import { WinData } from "models";
import { Jester } from "../src/game/role/Jester.js";
import { Villager, Werewolf } from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayersWith([
  Jester,
  Werewolf,
  ...times(5, () => Villager),
]);
const [jester, wolf, ...villagers] = players.map((it) => it.id);

function expectJesterWin(game: TestGame) {
  game.expectEvents("announcement.death", "win");
  expect(game.events[1].data).toMatchObject({
    state: {
      type: Jester.type,
      winners: [
        {
          id: jester,
        },
      ],
    },
  } as WinData);
}

describe("tests regarding the jester", () => {
  it("wins when they get lynched", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(wolf, playerVote(villagers[0]));

    await game.dismiss();

    game.expectEvents("kill.lynch");

    await game.vote(villagers.slice(1), playerVote(jester));

    await game.vote(jester, skipVote());
    await game.vote(wolf, skipVote());

    expectJesterWin(game);
  });

  it("does not win when he is eaten", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(wolf, playerVote(jester));

    await game.dismiss();

    game.expectEvents("kill.lynch");
  });

  it("takes priority over a potential wolf win", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    for (const villager of villagers) {
      await game.vote(wolf, playerVote(villager));

      await game.dismiss();

      game.expectEvents("kill.lynch");

      await game.dismiss();
    }

    await game.vote(wolf, skipVote());

    game.expectEvents("kill.lynch");
    await game.vote(wolf, playerVote(jester));
    await game.vote(jester, playerVote(jester));

    expectJesterWin(game);
  });
});
