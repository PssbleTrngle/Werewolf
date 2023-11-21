import { Game } from "../src/game/Game.js";
import { KillEvent } from "../src/game/event/KillEvent.js";
import LynchEvent from "../src/game/event/LynchEvent.js";
import { SleepBoundary } from "../src/game/event/SleepBoundary.js";
import { inGroup, isAlive } from "../src/game/player/predicates.js";
import { RoleGroup } from "../src/game/role/RoleGroup.js";
import { Villager } from "../src/game/role/Villager.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { DeathEvent } from "../src/index.js";
import { createTestPlayers } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayers(12, (i) => {
  const role = i % 3 === 0 ? new Werewolf() : new Villager();
  return { role };
});

describe("tests regarding wolf roles", () => {
  it("wolfs kill a player an get lynched", () => {
    const game = new Game(players);

    const dismiss = () => {
      players.forEach((it) => game.vote(it, skipVote()));
    };

    expect(game.frames).toBe(1);

    dismiss();

    expect(game.events[0]).toBeInstanceOf(KillEvent);
    expect(game.events[1]).toBeInstanceOf(SleepBoundary);
    expect(game.events).toHaveLength(2);

    expect(game.frames).toBe(2);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, playerVote(players[1])));

    expect(game.events[0]).toBeInstanceOf(DeathEvent);
    expect(game.events[1]).toBeInstanceOf(LynchEvent);
    expect(game.events).toHaveLength(2);

    expect(game.frames).toBe(3);

    dismiss();

    expect(game.frames).toBe(4);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, skipVote()));

    players
      .filter(inGroup(RoleGroup.VILLAGER))
      .forEach((it) => game.vote(it, playerVote(players[0])));

    expect(game.frames).toBe(5);

    const dead = game.players.filter((it) => !isAlive(it));
    expect(dead).toHaveLength(2);
  });
});
