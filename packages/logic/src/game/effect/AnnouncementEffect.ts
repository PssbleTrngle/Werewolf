import { Time } from "models";
import { arrayOrSelf } from "../../util.js";
import { EventFactoryBus } from "../event/EventBus.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export const AnnouncementEvents = new EventFactoryBus();

export class AnnouncementEffect implements Effect {
  constructor(private readonly time?: Time) {}

  apply(game: GameAccess) {
    game.broadcastDeaths(this.time);

    AnnouncementEvents.notify(game)
      .flatMap(arrayOrSelf)
      .forEach((it) => it.apply(game));
  }
}
