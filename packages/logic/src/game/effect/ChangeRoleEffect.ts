import type { Id, Role } from "models";
import { requirePlayer } from "../player/predicates.js";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class ChangeRoleEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly role: Role,
  ) {}

  apply(game: GameAccess) {
    game.logger.info(
      ` ${requirePlayer(game.players, this.playerId).name} turned into ${this.role.type}`,
    );
    game.modifyPlayer(this.playerId, { role: this.role });
  }
}
