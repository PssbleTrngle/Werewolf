import { Event } from "models";
import { Game, Player, isAlive } from "../../src/index.js";
import { skipVote } from "./votes.js";

export class TestGame extends Game {
  static create(players: ReadonlyArray<Player>) {
    return new TestGame(Game.createState(players));
  }

  expectEvents(...expected: string[]) {
    const actual = this.events.map((it) => it.type);
    expect(actual).toMatchObject(expected);
  }

  expectCurrentEvent<D = unknown>(expected: string | Partial<Event<D>>) {
    const actual = this.events[0];
    if (typeof expected === "string") {
      expect(actual.type).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  }

  async dismiss() {
    await Promise.all(
      this.players.filter(isAlive).map((it) => this.vote(it.id, skipVote()))
    );
  }
}
