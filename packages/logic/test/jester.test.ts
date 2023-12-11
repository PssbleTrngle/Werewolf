import { times } from "lodash-es";
import { WinData } from "models";
import { Jester } from "../src/game/role/Jester.js";
import { Villager, Werewolf } from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

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
  it("wins when they get lynched", () => {
    const game = TestGame.create(players);

    dismiss(game);

    game.vote(wolf, playerVote(villagers[0]));

    dismiss(game);

    game.expectEvents("kill.lynch");

    villagers.slice(1).forEach((it) => game.vote(it, playerVote(jester)));

    game.vote(jester, skipVote());
    game.vote(wolf, skipVote());

    expectJesterWin(game);
  });

  it("does not win when he is eaten", () => {
    const game = TestGame.create(players);

    dismiss(game);

    game.vote(wolf, playerVote(jester));

    dismiss(game);

    game.expectEvents("kill.lynch");
  });

  it("takes priority over a potential wolf win", () => {
    const game = TestGame.create(players);

    dismiss(game);

    for (const villager of villagers) {
      game.vote(wolf, playerVote(villager));

      dismiss(game);

      game.expectEvents("kill.lynch");

      dismiss(game);
    }

    game.vote(wolf, skipVote());

    game.expectEvents("kill.lynch");
    game.vote(wolf, playerVote(jester));
    game.vote(jester, playerVote(jester));

    expectJesterWin(game);
  });
});
