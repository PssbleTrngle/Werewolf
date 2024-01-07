import { Event, Role, Vote } from "models";
import { ArrayOrSingle, arrayOrSelf } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { SubjectMappers } from "../permissions/index.js";
import { Player } from "../player/Player.js";
import { GameReadAccess } from "../state.js";

export type EventFactory = (game: GameReadAccess) => ArrayOrSingle<Event>;

export abstract class EventType<T> {
  protected abstract viewData(
    player: Player,
    subject: T,
    mapper: SubjectMappers
  ): T;

  // TODO check in a while if player is neccessary
  view(player: Player, event: Event<T>, mapper: SubjectMappers): Event<T> {
    return {
      ...event,
      players: event.players.map((it) => mapper.mapPlayer(it)),
      data: this.viewData(player, event.data, mapper),
      choice: {
        ...event.choice,
        players: event.choice?.players?.map((it) => mapper.mapPlayer(it)) ?? [],
      },
    };
  }

  abstract finish(vote: Vote, event: Event<T>): ArrayOrSingle<Effect>;

  isFinished(_game: GameReadAccess, _event: Event<T>, _index: number) {
    return true;
  }

  usableByModerator(_game: GameReadAccess, _event: Event<T>) {
    return false;
  }
}

export function roleScopedFactory(
  role: Role,
  factory: EventFactory
): EventFactory {
  return (game) => {
    const created = arrayOrSelf(factory(game));
    return created.map((it) => ({ ...it, role }));
  };
}

export function individualEvents<T>(
  players: ReadonlyArray<Player>,
  factory: (players: ReadonlyArray<Player>) => Event<T>
): ArrayOrSingle<Event<T>> {
  if (players.length > 0) return players.map((it) => factory([it]));
  return factory([]);
}
