import { Id } from "models";
import { RevealEvent } from "../event/RevealEvent.js";
import { requirePlayer } from "../player/predicates.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class RevealEffect implements Effect {
  constructor(
    private readonly type: string,
    private readonly to: Id,
    private readonly targets: ReadonlyArray<Id>
  ) {}

  apply(game: GameAccess) {
    const targets = this.targets.map((it) => requirePlayer(game.players, it));
    const to = requirePlayer(game.players, this.to);

    game.immediately(() => RevealEvent.create(this.type, [to], targets));
  }
}
