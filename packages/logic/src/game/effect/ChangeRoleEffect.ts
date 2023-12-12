import { Id, Role } from "models";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class ChangeRoleEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly role: Role
  ) {}

  apply(game: GameAccess) {
    game.modifyPlayer(this.playerId, { role: this.role });
  }
}
