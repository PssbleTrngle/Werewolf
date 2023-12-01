import { Game, Player } from "../../src/index.js";

export class TestGame extends Game {
  static create(players: ReadonlyArray<Player>) {
    return new TestGame(Game.createState(players));
  }

  onSave() {
    // Not needed for now
  }
}
