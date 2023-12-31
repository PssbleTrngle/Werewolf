import { Choice, Event, Player as IPlayer, Vote } from "models";
import { Game } from "../index.js";
import { GameView } from "./index.js";
import { validateVote } from '../vote/Vote.js';

export class ModeratorGameView implements GameView {
  constructor(protected readonly game: Game) {}

  mapPlayer(subject: IPlayer) {
    return subject;
  }

  mapEvent<T>(subject: Event<T>) {
    const choice: Choice = {
      ...subject.choice,
      canSkip: subject.choice?.canSkip || subject.players.length > 1,
    };
    return { ...subject, choice };
  }

  currentEvent() {
    return this.mapEvent(this.events()[0]);
  }

  events() {
    return this.game.currentEvents().map((it) => this.mapEvent(it));
  }

  players() {
    return this.game.players.map((it) => this.mapPlayer(it));
  }

  gameInfo() {
    return this.game.status;
  }

  async vote(vote: Vote) {
    const event = this.currentEvent();
    validateVote(event.choice, vote);
    await this.game.vote(event.players, vote);
  }

  async undo() {
    this.game.undo();
  }

  async redo() {
    this.game.redo();
  }
}
