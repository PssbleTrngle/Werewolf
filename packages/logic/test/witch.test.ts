import { times } from "lodash-es";
import { isNotDead } from "../src/game/player/predicates.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { Seer, Villager } from "../src/index.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the witch", () => {
  it("witches events get pushed once the first death has occured", () => {
    const players = createTestPlayersWith([
      Werewolf,
      Witch,
      Seer,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    dismiss(game);

    game.vote(players[2].id, playerVote(players[0]));
    game.vote(players[2].id, skipVote());

    game.vote(players[0].id, playerVote(players[1]));

    game.expectEvents("revive.witch", "kill.witch", "sleep");

    game.vote(players[1].id, playerVote(players[1]));
    game.vote(players[1].id, skipVote());

    // No death announcement
    game.expectEvents("kill.lynch");

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(0);
  });

  it("witches can only revive/kill once", () => {
    const players = createTestPlayersWith([
      Werewolf,
      Witch,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    dismiss(game);

    game.vote(players[0].id, playerVote(players[3]));

    game.expectEvents("revive.witch", "kill.witch", "sleep");

    game.vote(players[1].id, playerVote(players[3]));
    game.vote(players[1].id, skipVote());

    // No death announcement
    game.expectEvents("kill.lynch");

    dismiss(game);

    game.vote(players[0].id, playerVote(players[4]));

    // witch has already revived
    game.expectEvents("kill.witch", "sleep");

    game.vote(players[1].id, playerVote(players[3]));

    dismiss(game);

    dismiss(game);

    game.vote(players[0].id, playerVote(players[2]));

    // witch has already revived & killed
    game.expectEvents("sleep");
  });
});
