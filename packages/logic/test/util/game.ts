import { Event } from "models";
import { Game, Player } from "../../src/index.js";

export class TestGame extends Game {
  static create(players: ReadonlyArray<Player>) {
    return new TestGame(Game.createState(players));
  }

  expectEvents(...expected: string[]) {
    const actual = this.events.map((it) => it.type);
    expect(actual).toMatchObject(expected);
  }

  expectCurrentEvent(expected: string | Partial<Event>) {
    const actual = this.events[0];
    if (typeof expected === "string") {
      expect(actual.type).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  }
}
