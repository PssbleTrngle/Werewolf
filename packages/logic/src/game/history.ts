import { GameState } from "./state.js";

export default class StateHistory {
  private history: ReadonlyArray<GameState>;
  private cursor;

  constructor(...initial: GameState[]) {
    if (initial.length === 0) {
      throw new Error("cannot create state history with empty initial state");
    }
    this.history = initial;
    this.cursor = initial.length - 1;
  }

  get current(): GameState {
    if (this.cursor >= this.history.length) {
      throw new Error(
        `Illegal cursor position ${this.cursor} for history with length ${this.history.length}`
      );
    }
    return this.history[this.cursor];
  }

  push(next: GameState) {
    const slicedHistory = this.history.slice(0, this.cursor + 1);
    this.history = [...slicedHistory, next];
    this.cursor++;
  }

  modify(factory: (previous: GameState) => Partial<GameState>) {
    const current = this.current;
    this.push({ ...current, ...factory(current) });
  }

  redo() {
    this.cursor = Math.min(this.history.length - 1, this.cursor + 1);
  }

  undo() {
    this.cursor = Math.max(0, this.cursor - 1);
  }

  save() {
    return this.history;
  }

  get future() {
    return this.history.length - (this.cursor + 1);
  }

  get past() {
    return this.cursor;
  }
}
