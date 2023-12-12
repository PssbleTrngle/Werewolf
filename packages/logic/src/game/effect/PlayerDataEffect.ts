import { Id } from "models";
import { PartialOrFactory, resolveFactory } from "../../util.js";
import { RoleData } from "../player/Player.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class PlayerDataEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly data: PartialOrFactory<RoleData>
  ) {}

  apply(game: GameAccess) {
    game.modifyPlayer(this.playerId, (it) => ({
      roleData: resolveFactory(this.data, it.roleData),
    }));
  }
}
