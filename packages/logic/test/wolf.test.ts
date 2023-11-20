import { Game } from "../src/game/Game";
import { KillEvent } from "../src/game/event/KillEvent";
import LynchEvent from "../src/game/event/LynchEvent";
import { SleepBoundary } from "../src/game/event/SleepBoundary";
import { inGroup } from "../src/game/player/predicates";
import { RoleGroup } from "../src/game/role/RoleGroup";
import { Villager } from "../src/game/role/Villager";
import { Werewolf } from "../src/game/role/Wolf";
import { createTestPlayers } from "./util/players";
import { playerVote, skipVote } from "./util/votes";

const players = createTestPlayers(12, (i) => {
  const role = i % 3 === 0 ? new Werewolf() : new Villager();
  return { role };
});

describe("tests regarding wolf roles", () => {
  it("wolfs kill a player an get lynched", () => {
    const game = new Game(players);
    const spy = vi.spyOn(game, "kill");

    game.start();

    expect(game.events).toHaveLength(2);
    expect(game.events[0]).toBeInstanceOf(KillEvent);
    expect(game.events[1]).toBeInstanceOf(SleepBoundary);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, playerVote(players[1])));

    expect(game.events).toHaveLength(1);
    expect(game.events[0]).toBeInstanceOf(LynchEvent);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, skipVote()));

    players
      .filter(inGroup(RoleGroup.VILLAGER))
      .forEach((it) => game.vote(it, playerVote(players[0])));

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
