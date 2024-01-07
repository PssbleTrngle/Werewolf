import { last } from "lodash-es";
import { DeathCause, Event, Id, Time, Vote } from "models";
import {
  ArrayOrSingle,
  PartialOrFactory,
  arrayOrSelf,
  notNull,
  resolvePartialFactory,
} from "../util.js";
import { Effect } from "./effect/Effect.js";
import { DeathEvent, DeathEvents, ProtectEvents } from "./event/DeathEvent.js";
import { EventFactory } from "./event/Event.js";
import { EventRegistry } from "./event/EventRegistry.js";
import { FakeEvent } from "./event/FakeEvent.js";
import { createFakePlayer } from "./index.js";
import revealPlayer from "./permissions/playerReveal.js";
import { Player } from "./player/Player.js";
import { isAlive, isDying, requirePlayer } from "./player/predicates.js";
import "./roleEvents.js";
import { GameAccess, GameState } from "./state.js";

export default class FrozenGame implements GameAccess {
  private readonly newEvents: EventFactory[] = [];
  private readonly deaths = new Map<Id, DeathCause>();
  private readonly revives = new Set<Id>();
  private readonly replaced = new Map<Event, EventFactory[]>();
  private readonly pendingReplace = new Set<EventFactory>();
  private clearDeaths = false;
  private readonly timesPassed: Time[] = [];
  private readonly playerModifiers = new Map<Id, Partial<Player>[]>();

  constructor(private readonly initial: GameState) {}

  immediately(factory: EventFactory) {
    this.pendingReplace.add(factory);
  }

  finish<T>(event: Event<T>, vote: Vote) {
    const type = EventRegistry.get(event.type);
    const effects = arrayOrSelf(type.finish(vote, event));
    effects.forEach((it) => it.apply(this));

    this.replaced.set(event, Array.from(this.pendingReplace));

    const prognose = this.pendingReplace.size;
    this.pendingReplace.clear();
    return prognose - 1;
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

  get settings() {
    return this.initial.settings;
  }

  modifyPlayer(id: Id, factory: PartialOrFactory<Player>) {
    const player = requirePlayer(this.players, id);
    const values = resolvePartialFactory(factory, player);
    if (this.playerModifiers.has(id)) {
      this.playerModifiers.get(id)?.push(values);
    } else {
      this.playerModifiers.set(id, [values]);
    }
  }

  kill(playerId: Id, cause: DeathCause) {
    const target = requirePlayer(this.players, playerId);

    const guarded = ProtectEvents.notify(target, cause, this).some(
      (it) => it === true
    );

    if (guarded) {
      console.log(target.name, "was protected against", cause);
      return;
    }

    console.log(target.name, "died by", cause);

    this.deaths.set(playerId, cause);

    const effects = DeathEvents.notify(target, cause, this).flatMap(
      arrayOrSelf
    );

    this.apply(effects);
  }

  revive(playerId: Id): void {
    const target = requirePlayer(this.players, playerId);
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

      if (unnotifiedDeaths.length === 0) {
        if (time) this.setTime(time);
        return [];
      }

      const revealedDeaths = unnotifiedDeaths.map((it) =>
        revealPlayer(it, this.settings.deathRevealType)
      );

      return DeathEvent.create(alive, revealedDeaths, time);
    });
  }

  private fakeEvent(event: Event): Event | null {
    if (event.players.length > 0 || !this.settings.fakePlayerScreens)
      return event;

    if (event.role && this.settings.disabledRoles?.includes(event.role.type)) {
      return null;
    }

    const fakePlayer = createFakePlayer(event.role);
    const type = EventRegistry.get(event.type);

    if (type.usableByModerator(this, event)) {
      return { ...event, players: [fakePlayer] };
    }

    return FakeEvent.create([fakePlayer], event, !!event.choice);
  }

  private resolveFactory(factory: EventFactory): Event[] {
    const result = arrayOrSelf(factory(this));
    return result.map((it) => this.fakeEvent(it)).filter(notNull);
  }

  unfreeze(): GameState {
    const factories = [
      ...this.initial.events.flatMap((it) => {
        return this.replaced.get(it) ?? (() => it);
      }),
      ...this.newEvents,
    ];

    const events = factories
      .flatMap((factory) => this.resolveFactory(factory))
      .filter((it) => it.players.length > 0);

    const time = last(this.timesPassed) ?? this.initial.time;
    const day =
      this.initial.day + this.timesPassed.filter((it) => it === "dawn").length;

    return {
      ...this.initial,
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
          const modifiers = this.playerModifiers.get(player.id) ?? [];
          return modifiers.reduce<Player>(
            (previous, values) => ({
              ...previous,
              ...values,
            }),
            player
          );
        }),
      events,
    };
  }
}
