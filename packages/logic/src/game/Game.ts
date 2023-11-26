import { last } from "lodash-es";
import { DeathCause, Event, GameStatus, Id, Time, Vote } from "models";
import { ArrayOrSingle, arrayOrSelf, notNull } from "../util.js";
import { Effect } from "./effect/Effect.js";
import { DeathEvent, DeathEvents } from "./event/DeathEvent.js";
import { EventFactory } from "./event/Event.js";
import { EventRegistry } from "./event/EventRegistry.js";
import { StartEvent } from "./event/StartEvent.js";
import WinEvent from "./event/WinEvent.js";
import { Player, RoleData } from "./player/Player.js";
import { isAlive, isDying } from "./player/predicates.js";
import "./roleEvents.js";
import { calculateWinner } from "./vote/Vote.js";
import { testWinConditions } from "./winConditions.js";

export interface GameState extends GameStatus {
  players: ReadonlyArray<Player>;
  events: ReadonlyArray<Event<unknown>>;
}

class StateHistory {
  private history: GameState[];
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

export interface GameReadAccess {
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
  modifyPlayerData(id: Id, data: Partial<RoleData>): void;
}

class FrozenGame implements GameAccess {
  private readonly newEvents: EventFactory[] = [];
  private readonly deaths = new Map<Id, DeathCause>();
  private readonly revives = new Set<Id>();
  private readonly replaced = new Map<Event<unknown>, EventFactory[]>();
  private readonly pendingReplace = new Set<EventFactory>();
  private clearDeaths = false;
  private readonly timesPassed: Time[] = [];
  private readonly playerDataModifiers = new Map<Id, Partial<RoleData>[]>();

  constructor(private readonly initial: GameState) {}

  immediately(factory: EventFactory) {
    this.pendingReplace.add(factory);
  }

  finish<T>(event: Event<T>, vote: Vote) {
    const type = EventRegistry.get(event.type);
    const effects = arrayOrSelf(type.finish(vote, event));
    effects.forEach((it) => it.apply(this));

    this.replaced.set(event, Array.from(this.pendingReplace));

    this.pendingReplace.clear();
  }

  hasFinished(event: Event<unknown>) {
    return this.replaced.get(event)?.length === 0;
  }

  apply(effects: ArrayOrSingle<Effect>) {
    arrayOrSelf(effects).forEach((it) => it.apply(this));
  }

  arise(factory: EventFactory) {
    this.newEvents.push(factory);
  }

  get players() {
    return this.initial.players.map((it) => ({
      // TODO this could be hurtful
      ...it,
      deathCause: this.deaths.get(it.id) ?? it.deathCause,
      status:
        this.deaths.has(it.id) && !this.revives.has(it.id)
          ? "dying"
          : it.status,
    }));
  }

  playerById(id: Id) {
    const match = this.initial.players.find((it) => it.id === id);
    if (match) return match;
    throw new Error(`Unknown Player with ID '${id}'`);
  }

  modifyPlayerData(id: Id, data: Partial<RoleData>) {
    if (this.playerDataModifiers.has(id)) {
      this.playerDataModifiers.get(id)?.push(data);
    } else {
      this.playerDataModifiers.set(id, [data]);
    }
  }

  kill(playerId: Id, cause: DeathCause) {
    const target = this.playerById(playerId);
    console.log(target.name, "died by", cause);

    const effects = DeathEvents.notify(target).flatMap(arrayOrSelf);
    // these should not be called if the target is revived and should therefore be called later
    // TODO
    // ...arrayOrSelf(target.role.onDeath(target)),

    this.apply(effects);

    this.deaths.set(playerId, cause);
  }

  revive(playerId: Id): void {
    const target = this.playerById(playerId);
    console.log(target.name, "was revived");
    this.revives.add(playerId);
  }

  setTime(time: Time) {
    this.timesPassed.push(time);
  }

  broadcastDeaths(time?: Time) {
    this.clearDeaths = true;

    this.arise(({ players }) => {
      const unnotifiedDeaths = players.filter(isDying);
      const alive = players.filter(isAlive);

      if (unnotifiedDeaths.length === 0) return [];

      return DeathEvent.create(alive, unnotifiedDeaths, time);
    });
  }

  unfreeze(): GameState {
    const factories = [
      ...this.initial.events.flatMap((it) => {
        return this.replaced.get(it) ?? (() => it);
      }),
      ...this.newEvents,
    ];

    const events = factories
      .flatMap((factory) => arrayOrSelf(factory(this)))
      .filter((it) => it.players.length > 0);

    const time = last(this.timesPassed) ?? this.initial.time;
    const day =
      this.initial.day + this.timesPassed.filter((it) => it === "dawn").length;

    return {
      time,
      day,
      players: this.players
        .map<Player>((player) => {
          if (this.revives.has(player.id))
            return { ...player, status: "alive" };
          if (isDying(player)) {
            return { ...player, status: this.clearDeaths ? "dead" : "dying" };
          } else return player;
        })
        .map<Player>((player) => {
          const modifiers = this.playerDataModifiers.get(player.id) ?? [];
          const roleData = modifiers.reduce<RoleData>(
            (previous, values) => ({ ...previous, ...values }),
            player.roleData
          );
          return { ...player, roleData };
        }),
      events,
    };
  }
}

export class Game {
  private state: StateHistory;
  private votes = new Map<Id, Vote>();

  private constructor(history: ReadonlyArray<GameState>) {
    this.state = new StateHistory(...history);
  }

  static create(players: ReadonlyArray<Player>): Game {
    return new Game([
      {
        players,
        day: 1,
        time: "dusk",
        events: [StartEvent.create(players)],
      },
    ]);
  }

  static read(history: ReadonlyArray<GameState>): Game {
    return new Game(history);
  }

  save(): GameState[] {
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
      this.state.push(access.unfreeze());

      const dying = this.players.some(isDying);
      const win = !dying && testWinConditions(this.freeze());
      if (win) {
        console.log(`We have a winner: ${win.type}`);
        const winEvent = WinEvent.create(this.players, win);
        this.state.modify((it) => {
          const keptEvents = it.events.filter((it) =>
            it.type.startsWith("announcement.")
          );
          return { events: [...keptEvents, winEvent] };
        });
      }
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
    const player = this.players.find((it) => it.id === id);
    if (!player) throw new Error(`Unknown player with id '${id}'`);

    const event = this.currentEvent(id);

    // TODO only here for sanity checks right now, maybe later there will be a role which is allowed to do this
    if (!event?.choice)
      throw new Error("player cannot vote as he has no choice");

    if (player.status === "dead")
      throw new Error(
        `dead players cannot vote: ${player.name} tried to vote on ${event?.type}`
      );

    console.log(player.name, "voted on", event.type);
    this.votes.set(player.id, vote);

    this.check();
  }
}
