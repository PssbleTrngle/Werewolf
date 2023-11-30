import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { SubjectMappers } from "../permissions.js";
import { Player } from "../player/Player.js";
import { GameReadAccess } from "../state.js";

export type EventFactory = (
  game: GameReadAccess
) => ArrayOrSingle<Event<unknown>>;

export abstract class EventType<T> {
  protected abstract viewData(
    player: Player,
    subject: T,
    mapper: SubjectMappers
  ): T;

  view(player: Player, event: Event<T>, mapper: SubjectMappers): Event<T> {
    return {
      ...event,
      players: event.players.map((it) => mapper.mapPlayer(it)),
      data: this.viewData(player, event.data, mapper),
      choice: {
        ...event.choice,
        players: event.choice?.players?.map((it) => mapper.mapPlayer(it)),
      },
    };
  }

  abstract finish(vote: Vote, event: Event<T>): ArrayOrSingle<Effect>;

  isFinished(_game: GameReadAccess, _event: Event<T>, _index: number) {
    return true;
  }
}
