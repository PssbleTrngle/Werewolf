import { DeathCause, Event, GameStatus, Id, Time } from "models";
import { ArrayOrSingle } from "../util.js";
import { Effect } from "./effect/Effect.js";
import { EventFactory } from "./event/Event.js";
import { Player, RoleData } from "./player/Player.js";
import "./roleEvents.js";

export interface GameState extends GameStatus, GameReadAccess {
  events: ReadonlyArray<Event<unknown>>;
}

export interface GameReadAccess {
  players: ReadonlyArray<Player>;
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
