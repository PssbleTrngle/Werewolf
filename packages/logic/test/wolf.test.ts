import { times } from "lodash-es";
import { RoleGroup } from "models";
import { inGroup, isAlive, isNotDead } from "../src/game/player/predicates.js";
import { DreamWolf } from "../src/game/role/DreamWolf.js";
import { Villager } from "../src/game/role/Villager.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { TestGame } from "./util/game.js";
import { createTestPlayers, createTestPlayersWith } from "./util/players.js";
import { dismiss, playerVote, skipVote } from "./util/votes.js";

describe("tests regarding wolf roles", () => {
  it("wolfs kill a player an get lynched", () => {
    const game = TestGame.create(
      createTestPlayers(12, (i) => {
        const role = i % 3 === 0 ? Werewolf : Villager;
        return { role };
      })
    );

    expect(game.status.queue?.past).toBe(0);

    dismiss(game);

    game.expectEvents("kill.wolfs", "sleep");

    expect(game.status.queue?.past).toBe(1);

    game.players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it.id, playerVote(game.players[1])));

    game.expectEvents("announcement.death", "kill.lynch");
    expect(game.events[1].players).toHaveLength(game.players.length - 1);

    expect(game.status.queue?.past).toBe(2);

    dismiss(game);

    expect(game.status.queue?.past).toBe(3);

    game.players
      .filter(isAlive)
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it.id, skipVote()));

    game.players
      .filter(isAlive)
      .filter(inGroup(RoleGroup.VILLAGER))
      .forEach((it) => game.vote(it.id, playerVote(game.players[0])));

    expect(game.status.queue?.past).toBe(4);

    const dead = game.players.filter((it) => !isNotDead(it));
    expect(dead).toHaveLength(2);
  });

  it("dreamwolf awakes only once another wolf has died", () => {
    const game = TestGame.create(
      createTestPlayersWith([DreamWolf, Werewolf, ...times(5, () => Villager)])
    );

    dismiss(game);

    game.expectCurrentEvent("kill.wolfs");
    expect(game.events[0].players).toHaveLength(1);
    expect(game.events[0].players).toMatchObject([game.players[1]]);
    game.vote(game.players[1].id, skipVote());

    game.expectEvents("kill.lynch");
    game.players.forEach((it) => game.vote(it.id, playerVote(game.players[1])));

    game.expectEvents("announcement.death", "kill.wolfs", "sleep");
    dismiss(game);

    expect(game.events[0].players).toHaveLength(1);
    expect(game.events[0].players).toMatchObject([game.players[0]]);
  });
});
