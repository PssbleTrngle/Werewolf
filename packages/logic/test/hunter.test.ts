import { times } from "lodash-es";
import { Game } from "../src/game/Game.js";
import { inGroup, isAlive } from "../src/game/player/predicates.js";
import { RoleGroup } from "../src/game/role/RoleGroup.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { DeathEvent, Hunter, Villager } from "../src/index.js";
import { createTestPlayers, createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the hunter", () => {
  it("hunter gets killed and seeks revenge", () => {
    const players = createTestPlayers(5, (i) => {
      const role = i === 0 ? new Hunter() : new Werewolf();
      return { role };
    });
    const game = new Game(players);

    dismiss(game);
    expect(game.status.queue?.past).toBe(1);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, playerVote(players[0])));

    expect(game.events[0].type).toBe("kill.hunter");
    expect(game.events[1].type).toBe("sleep");
    expect(game.events).toHaveLength(2);

    expect(game.status.queue?.past).toBe(2);

    game.vote(players[0], playerVote(players[2]));

    expect(game.events[0].type).toBe("announcement.death");
    expect(game.events[1].type).toBe("kill.lynch");
    expect((game.events[0] as DeathEvent).deaths).toHaveLength(2);
    expect((game.events[0] as DeathEvent).players).toHaveLength(
      players.length - 2
    );

    expect(game.status.queue?.past).toBe(3);

    const dead = game.players.filter((it) => !isAlive(it));
    expect(dead).toHaveLength(2);
  });

  it("hunter gets killed and can kill eventhough he is revived", () => {
    const players = createTestPlayersWith([
      new Werewolf(),
      new Hunter(),
      new Witch(),
      ...times(3, () => new Villager()),
    ]);
    const game = new Game(players);

    dismiss(game);

    game.vote(players[0], playerVote(players[1]));

    expect(game.events[0].type).toBe("kill.hunter");
    expect(game.events[1].type).toBe("revive.witch");
    expect(game.events[2].type).toBe("kill.witch");
    expect(game.events[3].type).toBe("sleep");
    expect(game.events).toHaveLength(4);

    game.vote(players[1], playerVote(players[0]));
    game.vote(players[2], playerVote(players[1]));
    game.vote(players[2], skipVote());

    expect(game.events[0].type).toBe("announcement.death");
    expect(game.events[1].type).toBe("kill.lynch");
    expect((game.events[0] as DeathEvent).deaths).toHaveLength(1);
    expect((game.events[0] as DeathEvent).players).toHaveLength(
      players.length - 1
    );

    const dead = game.players.filter((it) => !isAlive(it));
    expect(dead).toHaveLength(1);
  });
});
