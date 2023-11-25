import { Choice, Event as IEvent, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { Player } from "../player/Player.js";

export type EventFactory = (game: GameReadAccess) => ArrayOrSingle<Event>;

export abstract class Event implements IEvent {
  constructor(
    public readonly type: string,
    public readonly players: ReadonlyArray<Player>,
    public readonly choice?: Choice,
    public readonly timeLimit?: number,
  ) {}

  abstract finish(vote: Vote): ArrayOrSingle<Effect>;

  isFinished(_game: GameReadAccess) {
    return true;
  }
}
