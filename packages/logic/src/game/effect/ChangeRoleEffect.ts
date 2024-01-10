import { Id, Role } from "models";
import { requirePlayer } from "../player/predicates.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class ChangeRoleEffect implements Effect {
  constructor(
    private readonly playerId: Id,
    private readonly role: Role,
  ) {}

  apply(game: GameAccess) {
    console.log(
      requirePlayer(game.players, this.playerId).name,
      "turned into",
      this.role.type,
    );
    game.modifyPlayer(this.playerId, { role: this.role });
  }
}
