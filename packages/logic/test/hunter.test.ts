import { Game } from "../src/game/Game.js";
import LynchEvent from "../src/game/event/LynchEvent.js";
import { inGroup, isAlive } from "../src/game/player/predicates.js";
import { RoleGroup } from "../src/game/role/RoleGroup.js";
import { Werewolf } from "../src/game/role/Wolf.js";
import { DeathEvent, Hunter, KillEvent, SleepBoundary } from "../src/index.js";
import { createTestPlayers } from "./util/players.js";
import { playerVote, skipVote } from "./util/votes.js";

const players = createTestPlayers(5, (i) => {
  const role = i === 0 ? new Hunter() : new Werewolf();
  return { role };
});

describe("tests regarding the hunter", () => {
  it("hunter gets killed and seeks revenge", () => {
    const game = new Game(players);

    const dismiss = () => {
      players.forEach((it) => game.vote(it, skipVote()));
    };

    dismiss();
    expect(game.status.queue?.past).toBe(1);

    players
      .filter(inGroup(RoleGroup.WOLF))
      .forEach((it) => game.vote(it, playerVote(players[0])));

    expect(game.events[0]).toBeInstanceOf(KillEvent);
    expect(game.events[1]).toBeInstanceOf(SleepBoundary);
    expect(game.events).toHaveLength(2);

    expect(game.status.queue?.past).toBe(2);

    game.vote(players[0], playerVote(players[2]));

    expect(game.events[0]).toBeInstanceOf(DeathEvent);
    expect(game.events[1]).toBeInstanceOf(LynchEvent);
    expect((game.events[0] as DeathEvent).deaths).toHaveLength(2);
    expect((game.events[0] as DeathEvent).players).toHaveLength(
      players.length - 2
    );

    expect(game.status.queue?.past).toBe(3);

    const dead = game.players.filter((it) => !isAlive(it));
    expect(dead).toHaveLength(2);
  });
});
