import type { Id, Role } from "models";
import { ConvertEvent } from "../event/ConvertEvent.js";
import { registerEvent } from "../event/EventRegistry.js";
import { requirePlayer } from "../player/predicates.js";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class ChangeRoleEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly role: Role,
  ) {}

  apply(game: GameAccess) {
    const player = requirePlayer(game.players, this.playerId);

    game.logger.info(` ${player.name} turned into ${this.role.type}`);
    const modified = game.modifyPlayer(this.playerId, { role: this.role });

    game.immediately(() => ConvertEvent.create("role", modified));
  }
}

registerEvent("convert.role", new ConvertEvent());
