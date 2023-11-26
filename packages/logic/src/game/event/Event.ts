import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";

export type EventFactory = (
  game: GameReadAccess
) => ArrayOrSingle<Event<unknown>>;

export abstract class EventType<T = undefined> {
  abstract finish(vote: Vote, event: Event<T>): ArrayOrSingle<Effect>;

  isFinished(_game: GameReadAccess, _event: Event<T>, _index: number) {
    return true;
  }
}
