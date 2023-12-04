import { Event, GameStatus, Player as IPlayer, Vote } from "models";

export interface SubjectMappers {
  mapEvent<T>(subject: Event<T>): Event<T>;
  mapPlayer(subject: IPlayer): IPlayer;
}

export interface GameView extends SubjectMappers {
  currentEvent(): Event<unknown>;
  events(): ReadonlyArray<Event<unknown>>;
  players(): ReadonlyArray<IPlayer>;
  status(): GameStatus;

  vote(vote: Vote): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
}
