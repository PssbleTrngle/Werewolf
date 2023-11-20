import { Game } from "../Game";
import { DeathCause } from "../player/DeathCause";
import { Player } from "../player/Player";
import { Effect } from "./Effet";

export class KillEffect implements Effect {
  constructor(
    private readonly target: Player,
    private readonly cause: DeathCause
  ) {}

  apply(game: Game) {
    game.kill(this.target, this.cause);
  }
}
