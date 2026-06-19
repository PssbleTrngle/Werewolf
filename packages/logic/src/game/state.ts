import type {
  DeathCause,
  Event,
  GameInfo,
  GameSettings,
  Id,
  Time,
} from "models";
import type { Logger } from "../logging.js";
import type { ArrayOrSingle, PartialOrFactory } from "../util.js";
import type { Effect } from "./effect/Effect.js";
import type { EventFactory } from "./event/Event.js";
import type { Player } from "./player/Player.js";
import "./roleEvents.js";

export interface GameState extends GameInfo, GameReadAccess {
  events: ReadonlyArray<Event>;
}

export interface GameReadAccess {
  players: ReadonlyArray<Player>;
  settings: GameSettings;
}

export interface GameAccess extends GameReadAccess {
  kill(playerId: Id, cause: DeathCause): void;
  revive(playerId: Id): void;
  arise(factory: EventFactory): void;
  immediately(factory: EventFactory): void;
  broadcastDeaths(time?: Time): void;
  apply(effects: ArrayOrSingle<Effect>): void;
  setTime(time: Time): void;
  modifyPlayer(id: Id, data: PartialOrFactory<Player>): void;
  readonly logger: Logger;
}
