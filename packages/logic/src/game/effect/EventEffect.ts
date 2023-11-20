import { Game } from "../Game";
import { EventFactory } from "../event/Event";
import { Effect } from "./Effet";

export class EventEffect implements Effect {
  constructor(private readonly factory: EventFactory) {}

  apply(game: Game) {
    game.arise(this.factory(game.players));
  }
}
