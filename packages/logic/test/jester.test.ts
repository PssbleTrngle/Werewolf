import { times } from "lodash-es";
import { WinData } from "models";
import { Jester } from "../src/game/role/Jester.js";
import { Game, Villager, Werewolf } from "../src/index.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayersWith([
  Jester,
  Werewolf,
  ...times(5, () => Villager),
]);
const [jester, wolf, ...villagers] = players.map((it) => it.id);

function expectJesterWin(game: Game) {
  expect(game.events[0].type).toBe("announcement.death");
  expect(game.events[1].type).toBe("win");
  expect(game.events[1].data).toMatchObject({
    state: {
      type: "jester",
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
    const game = Game.create(players);

    dismiss(game);

    game.vote(wolf, playerVote(villagers[0]));

    dismiss(game);

    expect(game.events[0].type).toBe("kill.lynch");

    villagers.slice(1).forEach((it) => game.vote(it, playerVote(jester)));

    game.vote(jester, skipVote());
    game.vote(wolf, skipVote());

    expectJesterWin(game);
  });

  it("does not win when he is eaten", () => {
    const game = Game.create(players);

    dismiss(game);

    game.vote(wolf, playerVote(jester));

    dismiss(game);

    expect(game.events[0].type).toBe("kill.lynch");
    expect(game.events).toHaveLength(1);
  });

  it("takes priority over a potential wolf win", () => {
    const game = Game.create(players);

    dismiss(game);

    for (const villager of villagers) {
      game.vote(wolf, playerVote(villager));

      dismiss(game);

      expect(game.events[0].type).toBe("kill.lynch");

      dismiss(game);
    }

    game.vote(wolf, skipVote());

    expect(game.events[0].type).toBe("kill.lynch");
    game.vote(wolf, playerVote(jester));
    game.vote(jester, playerVote(jester));

    expectJesterWin(game);
  });
});
