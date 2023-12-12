import { Event, Player as IPlayer, Vote } from "models";
import { Game } from "../index.js";
import { GameView } from "./index.js";

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

  gameInfo() {
    return this.game.status;
  }

  async vote(vote: Vote) {
    const event = this.currentEvent();
    await this.game.vote(event.players, vote);
  }

  async undo() {
    this.game.undo();
  }

  async redo() {
    this.game.redo();
  }
}
