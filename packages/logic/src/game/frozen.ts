import { last } from "lodash-es";
import { DeathCause, Event, Id, Time, Vote } from "models";
import { ArrayOrSingle, arrayOrSelf } from "../util.js";
import { Effect } from "./effect/Effect.js";
import { DeathEvent, DeathEvents } from "./event/DeathEvent.js";
import { EventFactory } from "./event/Event.js";
import { EventRegistry } from "./event/EventRegistry.js";
import { Player, RoleData } from "./player/Player.js";
import { isAlive, isDying, requirePlayer } from "./player/predicates.js";
import "./roleEvents.js";
import { GameAccess, GameState } from "./state.js";

export default class FrozenGame implements GameAccess {
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

  get settings() {
    return this.initial.settings;
  }

  modifyPlayerData(id: Id, data: Partial<RoleData>) {
    if (this.playerDataModifiers.has(id)) {
      this.playerDataModifiers.get(id)?.push(data);
    } else {
      this.playerDataModifiers.set(id, [data]);
    }
  }

  kill(playerId: Id, cause: DeathCause) {
    const target = requirePlayer(this.players, playerId);
    console.log(target.name, "died by", cause);

    const effects = DeathEvents.notify(target).flatMap(arrayOrSelf);
    // these should not be called if the target is revived and should therefore be called later
    // TODO
    // ...arrayOrSelf(target.role.onDeath(target)),

    this.apply(effects);

    this.deaths.set(playerId, cause);
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
