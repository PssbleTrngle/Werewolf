import { Event, GameStatus, Player as IPlayer, Id, Vote } from "models";
import { EventType } from "./event/Event.js";
import { EventRegistry } from "./event/EventRegistry.js";
import { Game } from "./index.js";
import { Player } from "./player/Player.js";
import { isNotDead, requirePlayer } from "./player/predicates.js";

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

export class ModeratorGameView implements GameView {
  constructor(protected readonly game: Game) {}

  mapPlayer(subject: IPlayer) {
    return subject;
  }

  mapEvent<T>(subject: Event<T>) {
    return subject;
  }

  currentEvent() {
    return this.events()[0];
  }

  events() {
    return this.game.currentEvents();
  }

  players() {
    return this.game.players.map((it) => this.mapPlayer(it));
  }

  status() {
    return this.game.status;
  }

  async vote(vote: Vote) {
    const event = this.currentEvent();
    for (const player of event.players) {
      await this.game.vote(player.id, vote);
    }
  }

  async undo() {
    this.game.undo();
  }

  async redo() {
    this.game.redo();
  }
}

export class PlayerGameView implements GameView {
  constructor(
    protected readonly game: Game,
    protected readonly owner: Id
  ) {}

  mapPlayer(subject: IPlayer) {
    const owner = requirePlayer(this.game.players, this.owner);
    return playerViewFor(owner, subject);
  }

  mapEvent<T>(subject: Event<T>): Event<T> {
    const owner = requirePlayer(this.game.players, this.owner);
    const type = EventRegistry.get(subject.type) as EventType<T>;
    return type.view(owner, subject, this);
  }

  private createDeadEvent(): Event<undefined> {
    const owner = requirePlayer(this.game.players, this.owner);
    return {
      type: "dead",
      players: [owner],
      data: undefined,
    };
  }

  currentEvent() {
    const event = this.game.currentEvent(this.owner);
    return event ? this.mapEvent(event) : this.createDeadEvent();
  }

  events() {
    return this.game.eventsFor(this.owner).map((it) => this.mapEvent(it));
  }

  players(): readonly IPlayer[] {
    return this.game.players.map((it) => this.mapPlayer(it));
  }

  private notAllowed() {
    throw new Error("not allowed");
  }

  status() {
    const { day, time } = this.game.status;
    return { day, time };
  }

  async undo() {
    this.notAllowed();
  }

  async redo() {
    this.notAllowed();
  }

  async vote(vote: Vote) {
    await this.game.vote(this.owner, vote);
  }
}

export function playerViewFor(player: Player, subject: IPlayer): IPlayer {
  const revealed = player.roleData.revealedPlayers[subject.id] ?? {};

  const self: Partial<IPlayer> =
    player.id === subject.id ? { role: player.role } : {};

  return {
    ...self,
    ...revealed,
    id: subject.id,
    name: subject.name,
    status: isNotDead(subject) ? "alive" : "dead",
  };
}
