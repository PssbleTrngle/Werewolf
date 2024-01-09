import { times } from "lodash-es";
import { isNotDead, requirePlayer } from "../src/game/player/predicates.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { Hunter, Seer, Villager } from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the witch", () => {
  it("witches events get pushed once the first death has occured", async () => {
    const players = createTestPlayersWith([
      Werewolf,
      Witch,
      Seer,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(players[2].id, playerVote(players[0]));
    await game.vote(players[2].id, skipVote());

    await game.vote(players[0].id, playerVote(players[1]));

    game.expectEvents("revive.witch", "kill.witch", "sleep");

    await game.vote(players[1].id, playerVote(players[1]));
    await game.vote(players[1].id, skipVote());

    // No death announcement
    game.expectEvents("kill.lynch");

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(0);
  });

  it("witches can only revive/kill once", async () => {
    const players = createTestPlayersWith([
      Werewolf,
      Witch,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(players[0].id, playerVote(players[3]));

    game.expectEvents("revive.witch", "kill.witch", "sleep");

    await game.vote(players[1].id, playerVote(players[3]));
    await game.vote(players[1].id, skipVote());

    // No death announcement
    game.expectEvents("kill.lynch");

    await game.dismiss();

    await game.vote(players[0].id, playerVote(players[4]));

    // witch has already revived
    game.expectEvents("kill.witch", "sleep");

    await game.vote(players[1].id, playerVote(players[3]));

    await game.dismiss();

    await game.dismiss();

    await game.vote(players[0].id, playerVote(players[2]));

    // witch has already revived & killed
    game.expectEvents("announcement.death", "kill.lynch");
  });

  it("witches can revive themself after getting shot by the hunter", async () => {
    const players = createTestPlayersWith([
      Werewolf,
      Witch,
      Hunter,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    const [wolf, witch, hunter] = players.map((it) => it.id);

    await game.dismiss();

    await game.vote(wolf, playerVote(hunter));

    await game.vote(hunter, playerVote(witch));

    game.expectEvents("revive.witch", "kill.witch", "sleep");
    expect(game.events[0].choice?.players).toMatchObject([
      requirePlayer(game.players, witch),
      requirePlayer(game.players, hunter),
    ]);
  });
});
