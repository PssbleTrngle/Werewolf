import { Event, Id, Player as IPlayer, Vote } from "models";
import { omitByUndefined } from "../../util.js";
import { EventType } from "../event/Event.js";
import { EventRegistry } from "../event/EventRegistry.js";
import { Game } from "../index.js";
import { Player } from "../player/Player.js";
import { isNotDead, requirePlayer } from "../player/predicates.js";
import { validateVote } from "../vote/Vote.js";
import { GameView } from "./index.js";

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

  private createDeadEvent(): Event<never> {
    const owner = requirePlayer(this.game.players, this.owner);
    return {
      type: "dead",
      players: [owner],
      data: null as never,
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

  gameInfo() {
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
    const { choice } = this.currentEvent();
    if (choice) validateVote(choice, vote);
    await this.game.vote(this.owner, vote);
  }
}

export function playerViewFor(player: Player, subject: IPlayer): IPlayer {
  const revealed = player.roleData?.revealedPlayers?.[subject.id] ?? {};

  const common: IPlayer = {
    ...revealed,
    id: subject.id,
    name: subject.name,
    status: isNotDead(subject) ? "alive" : "dead",
  };

  if (player.id === subject.id) {
    const hallucinated = player.roleData?.hallucinated?.[subject.id];

    return omitByUndefined({
      ...common,
      role: player.role,
      ...hallucinated,
    });
  }

  return common;
}
