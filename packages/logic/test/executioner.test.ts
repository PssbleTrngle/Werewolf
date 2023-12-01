import { times } from "lodash-es";
import { WinData } from "models";
import {
  Executioner,
  Game,
  Villager,
  Werewolf,
  requirePlayer,
} from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayersWith([
  Executioner,
  Werewolf,
  ...times(5, () => Villager),
]);
const [executioner, wolf, ...villagers] = players.map((it) => it.id);

function expectExecutionerWin(game: Game) {
  expect(game.events[0].type).toBe("announcement.death");
  expect(game.events[1].type).toBe("win");
  expect(game.events[1].data).toMatchObject<WinData>({
    state: {
      type: "executioner",
      winners: [game.players[0]],
    },
  });
}

describe("tests regarding the executioner", () => {
  it("wins when they get lynched", () => {
    const game = TestGame.create(players);

    dismiss(game);

    const target = requirePlayer(game.players, executioner)?.roleData?.target;

    expect(target).not.toBeUndefined();
    assert(target);

    expect(game.events[0].type).toBe("reveal.executioner");
    game.vote(executioner, skipVote());

    game.vote(wolf, playerVote(villagers[0]));

    dismiss(game);

    expect(game.events[0].type).toBe("kill.lynch");

    villagers.slice(1).forEach((it) => game.vote(it, playerVote(target)));

    game.vote(executioner, skipVote());
    game.vote(wolf, skipVote());

    expectExecutionerWin(game);
  });
});
