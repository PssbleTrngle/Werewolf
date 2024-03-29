import { uniq } from "lodash-es";
import {
  defaultGameSettings,
  Event,
  GameInfo,
  GameSettings,
  Id,
  Player as IPlayer,
  Role,
  Vote,
} from "models";
import { arrayOrSelf, ArrayOrSingle, notNull } from "../util.js";
import { EventBus } from "./event/EventBus.js";
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

export type Votes = ReadonlyArray<[Id, Vote]>;

interface GameHooks {
  save: ReadonlyArray<GameState>;
  event: Event;
  vote: Votes;
}

export type GameHookKey = keyof GameHooks;

export type GameHookListener<T extends GameHookKey> = (
  subject: GameHooks[T],
) => void | Promise<void>;

export const FAKE_PLAYER_ID = "fake";
export function createFakePlayer(role?: Partial<Role>): IPlayer {
  return {
    name: "Noone",
    role,
    id: "fake",
    provider: "fake",
  };
}

export class Game implements GameReadAccess {
  private state: StateHistory;
  private votes: Map<Id, Vote>;

  private hooks = new Map<
    GameHookKey,
    EventBus<GameHookListener<GameHookKey>>
  >();

  constructor(history: ReadonlyArray<GameState>, initialVotes: Votes = []) {
    if (history.length === 0) throw new Error("Game history may not be empty");
    this.state = new StateHistory(...history);
    this.votes = new Map(initialVotes);
  }

  static createState(
    players: ReadonlyArray<Player>,
    settings: GameSettings = defaultGameSettings,
  ): ReadonlyArray<GameState> {
    return [
      {
        players,
        day: 1,
        time: "dusk",
        events: [StartEvent.create(players)],
        settings,
      },
    ];
  }

  private hookBus<T extends GameHookKey>(
    event: T,
  ): EventBus<GameHookListener<T>> {
    const existing = this.hooks.get(event);
    if (existing) return existing;
    const created = new EventBus<GameHookListener<GameHookKey>>();
    this.hooks.set(event, created);
    return created;
  }

  private async notify<T extends GameHookKey>(event: T, subject: GameHooks[T]) {
    await Promise.all(this.hookBus(event).notify(subject));
  }

  public on<T extends GameHookKey>(event: T, listener: GameHookListener<T>) {
    this.hookBus(event).register(listener);
  }

  private async save() {
    await this.notify("save", this.state.save());
  }

  async start() {
    const [event, ...rest] = this.events;
    if (rest.length > 0 || event.type !== "start") {
      throw new Error("game has already started");
    }

    await Promise.all([this.save(), this.notify("event", event)]);
  }

  get players() {
    return this.state.current.players;
  }

  get events() {
    return this.state.current.events;
  }

  get settings() {
    return this.state.current.settings;
  }

  get status(): GameInfo {
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
        it.type.startsWith("announcement."),
      );
      return { ...unfrozen, events: [...keptEvents, winEvent] };
    } else {
      return unfrozen;
    }
  }

  private checkEvent(
    access: FrozenGame,
    event: Event,
    index: number,
  ): number | false {
    const type = EventRegistry.get(event.type);

    const currentEvent = (id: Id) =>
      this.eventsFor(id).find((it) => !access.hasFinished(it));

    const arrived = event.players.filter((it) => currentEvent(it.id) === event);

    if (!type.isFinished(access, event, index)) return false;

    // some players still have something to do
    if (arrived.length < event.players.length) return false;

    let vote: Vote = { type: "skip" };
    if (event.choice) {
      const votes = event.players
        .map((it) => this.votes.get(it.id))
        .filter(notNull);

      // not everybody has voted yet
      if (votes.length < event.players.length) return false;

      vote = calculateWinner(event.choice, votes);
    }

    event.players.forEach((it) => this.votes.delete(it.id));
    return access.finish(event, vote);
  }

  private async check() {
    const access = this.freeze();

    const finished: Event[] = [];
    let prognose = 0;

    this.events.forEach((event, index) => {
      const result = this.checkEvent(access, event, index + prognose);
      if (result === false) return prognose;
      finished.push(event);
      prognose += result;
    });

    if (finished.length > 0) {
      const unfrozen = this.checkWin(access);
      this.state.push(unfrozen);

      const movedPlayers = uniq(
        finished.flatMap((it) => it.players).map((it) => it.id),
      );

      const newEvents = this.events
        .filter((it) =>
          it.players.every(({ id }) => this.currentEvent(id) === it),
        )
        .filter((it) => it.players.some(({ id }) => movedPlayers.includes(id)));

      await Promise.all([
        this.save(),
        ...newEvents.map((it) => this.notify("event", it)),
      ]);
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

  requirePlayer(id: Id) {
    if (id === FAKE_PLAYER_ID) return createFakePlayer();
    return requirePlayer(this.players, id);
  }

  async vote(playerIds: ArrayOrSingle<Id | IPlayer>, vote: Vote) {
    arrayOrSelf(playerIds).forEach((it) => {
      const id = typeof it === "string" ? it : it.id;
      const player = this.requirePlayer(id);

      const event = this.currentEvent(id);

      // TODO only here for sanity checks right now, maybe later there will be a role which is allowed to do this
      if (!event?.choice)
        throw new Error(
          `${player.name} cannot vote as he has no choice on ${event?.type}`,
        );

      if (player.status === "dead")
        throw new Error(
          `dead players cannot vote: ${player.name} tried to vote on ${event?.type}`,
        );

      console.log(player.name, "voted", vote, "on", event.type);
      this.votes.set(player.id, vote);
    });

    await this.check();
    await this.notify("vote", Array.from(this.votes.entries()));
  }
}
