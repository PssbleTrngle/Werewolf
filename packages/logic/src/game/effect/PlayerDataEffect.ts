import { Id } from "models";
import { RoleData } from "../player/Player.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class PlayerDataEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly data: Partial<RoleData>
  ) {}

  apply(game: GameAccess) {
    game.modifyPlayerData(this.playerId, this.data);
  }
}
