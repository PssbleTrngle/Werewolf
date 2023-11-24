import { times } from "lodash-es";
import { Game } from "../src/game/Game.js";
import { isAlive } from "../src/game/player/predicates.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { Seer, Villager } from "../src/index.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the witch", () => {
  it("witches events get pushed once the first death has occured", () => {
    const players = createTestPlayersWith([
      new Werewolf(),
      new Witch(),
      new Seer(),
      ...times(3, () => new Villager()),
    ]);
    const game = new Game(players);

    dismiss(game);

    game.vote(players[2], playerVote(players[0]));
    game.vote(players[2], skipVote());

    game.vote(players[0], playerVote(players[1]));

    expect(game.events[0].type).toBe("revive.witch");
    expect(game.events[1].type).toBe("kill.witch");
    expect(game.events[2].type).toBe("sleep");
    expect(game.events).toHaveLength(3);

    game.vote(players[1], playerVote(players[1]));
    game.vote(players[1], skipVote());

    // No death announcement
    expect(game.events[0].type).toBe("kill.lynch");
    expect(game.events).toHaveLength(1);

    const dead = game.players.filter((it) => !isAlive(it));
    expect(dead).toHaveLength(0);
  });

  it("witches can only revive/kill once", () => {
    const players = createTestPlayersWith([
      new Werewolf(),
      new Witch(),
      ...times(3, () => new Villager()),
    ]);
    const game = new Game(players);

    dismiss(game);

    game.vote(players[0], playerVote(players[3]));

    expect(game.events[0].type).toBe("revive.witch");
    expect(game.events[1].type).toBe("kill.witch");
    expect(game.events[2].type).toBe("sleep");
    expect(game.events).toHaveLength(3);

    game.vote(players[1], playerVote(players[3]));
    game.vote(players[1], skipVote());

    // No death announcement
    expect(game.events[0].type).toBe("kill.lynch");
    expect(game.events).toHaveLength(1);

    dismiss(game);

    game.vote(players[0], playerVote(players[4]));

    // witch has already revived
    expect(game.events[0].type).toBe("kill.witch");
    expect(game.events[1].type).toBe("sleep");
    expect(game.events).toHaveLength(2);

    game.vote(players[1], playerVote(players[3]));
  });
});
