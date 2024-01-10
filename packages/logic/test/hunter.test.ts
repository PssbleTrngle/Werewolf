import { times } from "lodash-es";
import { DeathCause, DeathData, RoleGroup } from "models";
import { inGroup, isNotDead } from "../src/game/player/predicates.js";
import { Hunter } from "../src/game/role/Hunter.js";
import { Villager } from "../src/game/role/Villager.js";
import { Witch } from "../src/game/role/Witch.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { TestGame } from "./util/game.js";
import { createTestPlayersWith } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

describe("tests regarding the hunter", () => {
  it("hunter gets killed and seeks revenge", async () => {
    const players = createTestPlayersWith([
      Hunter,
      ...times(4, () => Werewolf),
    ]);
    const game = TestGame.create(players);

    await game.dismiss();
    expect(game.status.queue?.past).toBe(1);

    await game.vote(
      players.filter(inGroup(RoleGroup.WOLF)),
      playerVote(players[0]),
    );

    game.expectEvents("kill.hunter", "sleep");

    expect(game.status.queue?.past).toBe(2);

    await game.vote(players[0].id, playerVote(players[2]));

    game.expectEvents("announcement.death", "win");
    expect((game.events[0].data as DeathData).deaths).toHaveLength(2);
    expect((game.events[0].data as DeathData).deaths[0].deathCause).toBe(
      DeathCause.WOLFS,
    );
    expect((game.events[0].data as DeathData).deaths[1].deathCause).toBe(
      DeathCause.HUNTER,
    );
    expect(game.events[0].players).toHaveLength(players.length - 2);

    expect(game.status.queue?.past).toBe(3);

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(2);
    expect(dead[0].deathCause).toBe(DeathCause.WOLFS);
    expect(dead[1].deathCause).toBe(DeathCause.HUNTER);
  });

  it("hunter gets killed and can kill eventhough he is revived", async () => {
    const players = createTestPlayersWith([
      Werewolf,
      Hunter,
      Witch,
      ...times(3, () => Villager),
    ]);
    const game = TestGame.create(players);

    await game.dismiss();

    await game.vote(players[0].id, playerVote(players[1]));

    game.expectEvents("kill.hunter", "trigger.witch", "sleep");

    await game.vote(players[1].id, playerVote(players[0]));

    game.expectEvents("revive.witch", "kill.witch", "sleep");

    await game.vote(players[2].id, playerVote(players[1]));
    await game.vote(players[2].id, skipVote());

    game.expectEvents("announcement.death", "win");
    expect((game.events[0].data as DeathData).deaths).toHaveLength(1);
    expect(game.events[0].players).toHaveLength(players.length - 1);

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(1);
  });
});
