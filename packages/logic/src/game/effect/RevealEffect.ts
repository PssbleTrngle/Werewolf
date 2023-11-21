import { Id } from "models";
import { GameAccess } from "../Game.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { Player } from "../player/Player.js";
import { Effect } from "./Effect.js";

export class RevealEffect implements Effect {
  constructor(
    private readonly to: Player,
    private readonly targets: ReadonlyArray<Id>
  ) {}

  apply(game: GameAccess) {
    const targets = this.targets.map((it) => game.playerById(it));
    game.immediately(() => new RevealEvent([this.to], targets));
  }
}
