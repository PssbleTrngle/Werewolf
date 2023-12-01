import { times } from "lodash-es";
import { DeathCause, DeathData, RoleGroup } from "models";
import { inGroup, isNotDead } from "../src/game/player/predicates.js";
import { Hunter } from "../src/game/role/Hunter.js";
import { Villager } from "../src/game/role/Villager.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the hunter", () => {
  it("hunter gets killed and seeks revenge", () => {
    const players = createTestPlayersWith([
      Hunter,
      ...times(4, () => Werewolf),
    ]);
    const game = TestGame.create(players);

    dismiss(game);
    expect(game.status.queue?.past).toBe(1);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it.id, playerVote(players[0])));

    expect(game.events[0].type).toBe("kill.hunter");
    expect(game.events[1].type).toBe("sleep");
    expect(game.events).toHaveLength(2);

    expect(game.status.queue?.past).toBe(2);

    game.vote(players[0].id, playerVote(players[2]));

    expect(game.events[0].type).toBe("announcement.death");
    expect((game.events[0].data as DeathData).deaths).toHaveLength(2);
    expect((game.events[0].data as DeathData).deaths[0].deathCause).toBe(
      DeathCause.WOLFS
    );
    expect((game.events[0].data as DeathData).deaths[1].deathCause).toBe(
      DeathCause.HUNTER
    );
    expect(game.events[0].players).toHaveLength(players.length - 2);
    expect(game.events[1].type).toBe("win");

    expect(game.status.queue?.past).toBe(3);

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(2);
    expect(dead[0].deathCause).toBe(DeathCause.WOLFS);
    expect(dead[1].deathCause).toBe(DeathCause.HUNTER);
  });

  it("hunter gets killed and can kill eventhough he is revived", () => {
    const players = createTestPlayersWith([
      Werewolf,
      Hunter,
      Witch,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    dismiss(game);

    game.vote(players[0].id, playerVote(players[1]));

    expect(game.events[0].type).toBe("kill.hunter");
    expect(game.events[1].type).toBe("revive.witch");
    expect(game.events[2].type).toBe("kill.witch");
    expect(game.events[3].type).toBe("sleep");
    expect(game.events).toHaveLength(4);

    game.vote(players[1].id, playerVote(players[0]));
    game.vote(players[2].id, playerVote(players[1]));
    game.vote(players[2].id, skipVote());

    expect(game.events[0].type).toBe("announcement.death");
    expect(game.events[1].type).toBe("win");
    expect((game.events[0].data as DeathData).deaths).toHaveLength(1);
    expect(game.events[0].players).toHaveLength(players.length - 1);

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(1);
  });
});
