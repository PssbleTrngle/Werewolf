import { DeathData, Event, Player as IPlayer, Time, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { registerEventFactory } from "./EventRegistry.js";

export const DeathEvents = new EventBus<
  (player: Player) => ArrayOrSingle<Effect> | false
>();

export class DeathEvent extends EventType<DeathData> {
  static create = registerEventFactory(
    "announcement.death",
    new DeathEvent(),
    (deaths: ReadonlyArray<IPlayer>, time?: Time) => ({
      choice: DismissChoice,
      data: {
        deaths,
        time,
      },
    })
  );

  finish(_vote: Vote, { data }: Event<DeathData>) {
    if (data.time) return new TimeEffect(data.time);
    return [];
  }
}
