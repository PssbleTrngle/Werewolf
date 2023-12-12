import { Id, PlayerRevealType } from "models";
import { RevealEvent } from "../event/RevealEvent.js";
import revealPlayer from "../permissions/playerReveal.js";
import { requirePlayer } from "../player/predicates.js";
import { GameAccess, GameReadAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class RevealEffect implements Effect {
  constructor(
    private readonly type: string,
    private readonly to: Id,
    private readonly targets: ReadonlyArray<Id>,
    private readonly revealType:
      | PlayerRevealType
      | ((game: GameReadAccess) => PlayerRevealType) = PlayerRevealType.ROLE
  ) {}

  apply(game: GameAccess) {
    const targets = this.targets.map((it) => requirePlayer(game.players, it));
    const to = requirePlayer(game.players, this.to);

    const revealType =
      typeof this.revealType === "string"
        ? this.revealType
        : this.revealType(game);
    const revealed = targets.map((it) => revealPlayer(it, revealType));

    game.immediately(() => RevealEvent.create(this.type, [to], revealed));
  }
}
