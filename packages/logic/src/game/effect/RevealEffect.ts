import { Id } from "models";
import { GameAccess } from "../Game.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { Effect } from "./Effect.js";

export class RevealEffect implements Effect {
  constructor(
    private readonly type: string,
    private readonly to: Id,
    private readonly targets: ReadonlyArray<Id>
  ) {}

  apply(game: GameAccess) {
    const targets = this.targets.map((it) => game.playerById(it));
    const to = game.playerById(this.to);
    game.immediately(() => RevealEvent.create(this.type, [to], targets));
  }
}
