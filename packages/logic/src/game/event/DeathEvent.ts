import type {
  DeathCause,
  DeathData,
  Event,
  Player as IPlayer,
  Time,
  Vote,
} from "models";
import type { ArrayOrSingle } from "../../util.js";
import type { Effect } from "../effect/Effect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import type { Player } from "../player/Player.js";
import type { GameReadAccess } from "../state.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { registerEventFactory } from "./EventRegistry.js";

export const DeathEvents = new EventBus<
  (
    player: Player,
    cause: DeathCause,
    game: GameReadAccess,
  ) => ArrayOrSingle<Effect> | false
>();

export const ProtectEvents = new EventBus<
  (player: Player, cause: DeathCause, game: GameReadAccess) => boolean
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
    }),
  );

  finish(_vote: Vote, { data }: Event<DeathData>) {
    if (data.time) return new TimeEffect(data.time);
    return [];
  }

  protected viewData(_player: Player, subject: DeathData): DeathData {
    return subject;
  }
}
