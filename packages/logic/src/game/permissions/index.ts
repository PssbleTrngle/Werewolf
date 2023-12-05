import { Event, GameInfo, Player as IPlayer, Vote } from "models";

export interface SubjectMappers {
  mapEvent<T>(subject: Event<T>): Event<T>;
  mapPlayer(subject: IPlayer): IPlayer;
}

export interface GameView extends SubjectMappers {
  currentEvent(): Event;
  events(): ReadonlyArray<Event>;
  players(): ReadonlyArray<IPlayer>;
  gameInfo(): GameInfo;

  vote(vote: Vote): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
}
