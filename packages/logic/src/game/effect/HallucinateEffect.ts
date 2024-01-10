import { Id, Role } from "models";
import { RevealEvent } from "../event/RevealEvent.js";
import revealPlayer from "../permissions/playerReveal.js";
import { requirePlayer } from "../player/predicates.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class HallucinateEffect implements Effect {
  constructor(
    private readonly type: string | Role,
    private readonly to: Id,
    private readonly targets: ReadonlyArray<Id>,
  ) {}

  apply(game: GameAccess) {
    const to = requirePlayer(game.players, this.to);
    const targets = this.targets
      .map((it) => requirePlayer(game.players, it))
      .map((it) => {
        const hallucinated = to.roleData.hallucinated?.[it.id];
        if (!hallucinated) {
          throw new Error(
            `roleData for ${to.name} has not been set correctly, hallucinatedRoles missing`,
          );
        }

        return revealPlayer(
          {
            ...it,
            ...hallucinated,
          },
          game.settings.seerRevealType,
        );
      });

    game.immediately(() => RevealEvent.create(this.type, [to], targets));
  }
}
