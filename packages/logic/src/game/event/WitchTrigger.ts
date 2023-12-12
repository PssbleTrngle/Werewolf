import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { SubjectMappers } from "../permissions/index.js";
import { Player } from "../player/Player.js";
import {
  isAlive,
  isDying,
  others,
  requirePlayer,
} from "../player/predicates.js";
import { GameReadAccess } from "../state.js";
import { NoDataEvent } from "./NoDataEvent.js";
import PotionKillEvent from "./PotionKillEvent.js";
import PotionReviveEvent from "./PotionReviveEvent.js";

export class WitchTrigger extends NoDataEvent {
  static create = this.createFactory("trigger.witch", new WitchTrigger());

  finish(_vote: Vote, event: Event<never>): ArrayOrSingle<Effect> {
    return new EventEffect((game) => {
      const dying = game.players.filter(isDying);

      const alive = game.players.filter(isAlive);

      const users = event.players.map((it) =>
        requirePlayer(game.players, it.id)
      );

      const revive = PotionReviveEvent.create(
        users.filter((it) => !it.roleData.usedRevivePotion),
        dying
      );

      const kill = PotionKillEvent.create(
        users.filter((it) => !it.roleData.usedKillPotion),
        alive.filter(others(...users))
      );

      if (dying.length === 0)
        return [PotionReviveEvent.create([], dying), kill];
      return [revive, kill];
    }, true);
  }

  isFinished(
    _game: GameReadAccess,
    _event: Event<never>,
    index: number
  ): boolean {
    return index === 0; // || game.players.some(isDying);
  }

  view(
    _player: Player,
    _event: Event<never>,
    _mapper: SubjectMappers
  ): Event<never> {
    return {
      type: "sleep",
      data: null as never,
      players: [],
    };
  }
}
