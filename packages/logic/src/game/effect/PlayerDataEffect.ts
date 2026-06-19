import type { Id } from "models";
import type { PartialOrFactory } from "../../util.js";
import { resolveFactory } from "../../util.js";
import type { RoleData } from "../player/Player.js";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class PlayerDataEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly data: PartialOrFactory<RoleData>,
  ) {}

  apply(game: GameAccess) {
    game.modifyPlayer(this.playerId, (it) => ({
      roleData: resolveFactory(this.data, it.roleData),
    }));
  }
}
