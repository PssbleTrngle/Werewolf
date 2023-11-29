import { GameSettings, GameStatus, Id, Vote } from "models";
import { notNull } from "../util.js";
import { EventRegistry } from "./event/EventRegistry.js";
import { StartEvent } from "./event/StartEvent.js";
import WinEvent from "./event/WinEvent.js";
import FrozenGame from "./frozen.js";
import StateHistory from "./history.js";
import { Player } from "./player/Player.js";
import { isDying, requirePlayer } from "./player/predicates.js";
import "./roleEvents.js";
import { GameReadAccess, GameState } from "./state.js";
import { calculateWinner } from "./vote/Vote.js";
import { testWinConditions } from "./winConditions.js";

export class Game implements GameReadAccess {
  private state: StateHistory;
  private votes = new Map<Id, Vote>();

  private constructor(
    history: ReadonlyArray<GameState>,
    public readonly settings: GameSettings
  ) {
    this.state = new StateHistory(...history);
  }

  static create(
    players: ReadonlyArray<Player>,
    settings: GameSettings = {}
  ): Game {
    return new Game(
      [
        {
          players,
          day: 1,
          time: "dusk",
          events: [StartEvent.create(players)],
          settings,
        },
      ],
      settings
    );
  }

  static read(
    history: ReadonlyArray<GameState>,
    settings: Readonly<GameSettings> = {}
  ): Game {
    return new Game(history, settings);
  }

  save(): ReadonlyArray<GameState> {
    return this.state.save();
  }

  get players() {
    return this.state.current.players;
  }

  get events() {
    return this.state.current.events;
  }

  get status(): GameStatus {
    const { day, time } = this.state.current;
    const past = this.state.past;
    const writtenFuture = this.state.future;
    const unknownFuture = this.events.length - 1;
    return { day, time, queue: { past, writtenFuture, unknownFuture } };
  }

  undo() {
    this.state.undo();
  }

  redo() {
    this.state.redo();
  }

  private freeze(): FrozenGame {
    return new FrozenGame(this.state.current);
  }

  private checkWin(access: FrozenGame): GameState {
    const unfrozen = access.unfreeze();

    const dying = unfrozen.players.some(isDying);
    const win = !dying && testWinConditions(unfrozen);

    if (win) {
      console.log(`We have a winner: ${win.type}`);

      const winEvent = WinEvent.create(unfrozen.players, win);
      const keptEvents = unfrozen.events.filter((it) =>
        it.type.startsWith("announcement.")
      );
      return { ...unfrozen, events: [...keptEvents, winEvent] };
    } else {
      return unfrozen;
    }
  }

  private check() {
    const access = this.freeze();

    const dirty = this.events.filter((event, i) => {
      const type = EventRegistry.get(event.type);

      const currentEvent = (id: Id) =>
        this.eventsFor(id).find((it) => !access.hasFinished(it));

      const arrived = event.players.filter(
        (it) => currentEvent(it.id) === event
      );

      if (!type.isFinished(access, event, i)) return;

      // some players still have something to do
      if (arrived.length < event.players.length) return false;

      let vote: Vote = { type: "skip" };
      if (event.choice) {
        const votes = event.players
          .map((it) => this.votes.get(it.id))
          .filter(notNull);

        // not everybody has voted yet
        if (votes.length < event.players.length) return false;

        vote = calculateWinner(votes);
      }

      event.players.forEach((it) => this.votes.delete(it.id));
      access.finish(event, vote);

      return true;
    });

    if (dirty.length > 0) {
      const unfrozen = this.checkWin(access);
      this.state.push(unfrozen);
    }
  }

  eventsFor(id: Id) {
    return this.events.filter((it) => it.players.some((p) => p.id === id));
  }

  currentEvent(id: Id) {
    return this.events.find((it) => it.players.some((p) => p.id === id));
  }

  currentEvents() {
    return this.events.filter((event) => {
      return event.players.some((it) => this.currentEvent(it.id) === event);
    });
  }

  vote(id: Id, vote: Vote) {
    const player = requirePlayer(this.players, id);

    const event = this.currentEvent(id);

    // TODO only here for sanity checks right now, maybe later there will be a role which is allowed to do this
    if (!event?.choice)
      throw new Error(
        `${player.name} cannot vote as he has no choice on ${event?.type}`
      );

    if (player.status === "dead")
      throw new Error(
        `dead players cannot vote: ${player.name} tried to vote on ${event?.type}`
      );

    console.log(player.name, "voted on", event.type);
    this.votes.set(player.id, vote);

    this.check();
  }
}
