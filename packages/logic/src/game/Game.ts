import { last } from "lodash-es";
import { GameStatus, Id, Time, Vote } from "models";
import { ArrayOrSingle, arrayOrSelf, notNull } from "../util.js";
import { Effect } from "./effect/Effect.js";
import { DeathEvent, DeathEvents } from "./event/DeathEvent.js";
import { Event, EventFactory } from "./event/Event.js";
import { StartEvent } from "./event/StartEvent.js";
import { DeathCause } from "./player/DeathCause.js";
import { Player } from "./player/Player.js";
import { isAlive } from "./player/predicates.js";
import "./roleEvents.js";
import { calculateWinner } from "./vote/Vote.js";

interface GameState extends GameStatus {
  players: ReadonlyArray<Player>;
  events: ReadonlyArray<Event>;
}

class StateHistory {
  private history: GameState[];
  private cursor = 0;

  constructor(initial: GameState) {
    this.history = [initial];
  }

  get current(): GameState {
    return this.history[this.cursor];
  }

  push(next: GameState) {
    this.cursor = this.history.length;
    this.history.push(next);
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

  get future() {
    return this.history.length - (this.cursor + 1);
  }

  get past() {
    return this.cursor;
  }
}

export interface GameReadAccess {
  unnotifiedDeaths: ReadonlyArray<Id>;
  players: ReadonlyArray<Player>;
  playerById(id: Id): Player;
}

export interface GameAccess extends GameReadAccess {
  kill(playerId: Id, cause: DeathCause): void;
  revive(playerId: Id): void;
  arise(factory: EventFactory): void;
  immediately(factory: EventFactory): void;
  broadcastDeaths(time?: Time): void;
  apply(effects: ArrayOrSingle<Effect>): void;
  setTime(time: Time): void;
}

class FrozenGame implements GameAccess {
  private readonly newEvents: EventFactory[] = [];
  private readonly deaths = new Set<Id>();
  private readonly revives = new Set<Id>();
  private readonly replaced = new Map<Event, EventFactory[]>();
  private readonly pendingReplace = new Set<EventFactory>();
  private clearDeaths = false;
  private readonly timesPassed: Time[] = [];

  constructor(private readonly initial: GameState) {
    this.deaths = new Set();
  }

  immediately(factory: EventFactory) {
    this.pendingReplace.add(factory);
  }

  finish(event: Event, vote: Vote) {
    const effects = arrayOrSelf(event.finish(vote));
    effects.forEach((it) => it.apply(this));

    this.replaced.set(event, Array.from(this.pendingReplace));

    this.pendingReplace.clear();
  }

  hasFinished(event: Event) {
    return this.replaced.get(event)?.length === 0;
  }

  apply(effects: ArrayOrSingle<Effect>) {
    arrayOrSelf(effects).forEach((it) => it.apply(this));
  }

  arise(factory: EventFactory) {
    this.newEvents.push(factory);
  }

  get players() {
    return this.initial.players;
  }

  playerById(id: Id) {
    const match = this.initial.players.find((it) => it.id === id);
    if (match) return match;
    throw new Error(`Unknown Player with ID '${id}'`);
  }

  kill(playerId: Id, cause: DeathCause) {
    const target = this.playerById(playerId);
    console.log(target.name, "died by", cause);

    const effects = [
      ...DeathEvents.createEffects(),
      // these should not be called if the target is revived and should therefore be called later
      ...arrayOrSelf(target.role.onDeath(target)),
    ];
    this.apply(effects);

    this.deaths.add(playerId);
  }

  revive(playerId: Id): void {
    const target = this.playerById(playerId);
    console.log(target.name, "was revived");
    this.revives.add(playerId);
  }

  setTime(time: Time) {
    this.timesPassed.push(time);
  }

  get unnotifiedDeaths() {
    const initial = this.initial.players
      .filter((it) => it.status === "dying")
      .map((it) => it.id);

    return [...initial, ...Array.from(this.deaths.keys())].filter(
      (it) => !this.revives.has(it)
    );
  }

  broadcastDeaths(time?: Time) {
    this.clearDeaths = true;

    this.arise(({ players, unnotifiedDeaths }) => {
      const alive = players
        .filter(isAlive)
        .filter((it) => !unnotifiedDeaths.includes(it.id));

      if (unnotifiedDeaths.length === 0) return [];

      return new DeathEvent(
        alive,
        unnotifiedDeaths.map((it) => this.playerById(it)),
        time
      );
    });
  }

  unfreeze(): GameState {
    const factories = [
      ...this.initial.events.flatMap((it) => {
        return this.replaced.get(it) ?? (() => it);
      }),
      ...this.newEvents,
    ];

    const events = factories.flatMap((factory) => arrayOrSelf(factory(this)));

    const time = last(this.timesPassed) ?? this.initial.time;
    const day =
      this.initial.day + this.timesPassed.filter((it) => it === "dawn").length;

    return {
      time,
      day,
      players: this.initial.players.map((player) => {
        if (this.revives.has(player.id)) return { ...player, status: "alive" };
        if (this.deaths.has(player.id) || player.status === "dying") {
          return { ...player, status: this.clearDeaths ? "dead" : "dying" };
        } else return player;
      }),
      events,
    };
  }
}

export class Game {
  private state: StateHistory;
  private votes = new Map<Player["id"], Vote>();

  constructor(players: ReadonlyArray<Player>) {
    this.state = new StateHistory({
      players,
      day: 1,
      time: "dusk",
      events: [new StartEvent(players)],
    });
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

  private check() {
    const access = this.freeze();

    const dirty = this.events.filter((event) => {
      const arrived = event.players.filter(
        (it) =>
          this.eventsFor(it).find((it) => !access.hasFinished(it)) === event
      );

      if (!event.isFinished(access)) return;

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
      this.state.push(access.unfreeze());
    }
  }

  eventsFor(player: Player) {
    return this.events.filter((it) => it.players.includes(player));
  }

  currentEvent(player: Player) {
    return this.events.find((it) => it.players.includes(player));
  }

  currentEvents() {
    return this.events.filter((event) => {
      return event.players.some((it) => this.currentEvent(it) === event);
    });
  }

  vote(player: Player, vote: Vote) {
    const event = this.currentEvent(player);
    if (!event?.choice) return;

    console.log(player.name, "voted on", event.type);
    this.votes.set(player.id, vote);

    this.check();
  }
}
