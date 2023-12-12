import { times } from "lodash-es";
import { DeathData } from "models";
import { Cursed } from "../src/game/role/Cursed.js";
import { Villager, Werewolf, Witch } from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayersWith([
  Cursed,
  Werewolf,
  Witch,
  ...times(5, () => Villager),
]);
const [cursed, wolf, witch] = players.map((it) => it.id);

describe("tests regarding the cursed", () => {
  it("turns into a werewolf when attacked", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(wolf, playerVote(cursed));

    // No one died so the witch will not be notified
    game.expectEvents("kill.witch", "sleep");
    await game.vote(witch, skipVote());

    expect(game.requirePlayer(cursed).role).toBe(Werewolf);
  });

  it("keeps the game going even if all other wolfs die turning the same night they are turned", async () => {
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(wolf, playerVote(cursed));

    // No one died so the witch will not be notified
    game.expectEvents("kill.witch", "sleep");
    await game.vote(witch, playerVote(wolf));

    game.expectEvents("announcement.death", "kill.lynch");
    expect((game.events[0].data as DeathData).deaths).toHaveLength(1);

    expect(game.requirePlayer(cursed).role).toBe(Werewolf);
  });
});
