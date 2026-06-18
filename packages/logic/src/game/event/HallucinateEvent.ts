import type { Event, Role, Vote } from "models";
import type { ArrayOrSingle } from "../../util.js";
import type { Effect } from "../effect/Effect.js";
import { HallucinateEffect } from "../effect/HallucinateEffect.js";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import { registerEventFactory } from "./EventRegistry.js";
import { NoDataEvent } from "./NoDataEvent.js";

export class HallucinateEvent extends NoDataEvent {
  static create = registerEventFactory(
    "hallucinate",
    new HallucinateEvent(),
    (role: Partial<Role>, targets: ReadonlyArray<Player>) => ({
      role,
      choice: { players: targets },
      data: null as never,
    }),
  );

  finish(vote: Vote, event: Event<undefined>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      return new HallucinateEffect(
        event.role as Role,
        event.players[0]!!.id,
        vote.players,
      );
    }

    return [];
  }

  override view(
    player: Player,
    event: Event<never>,
    mapper: SubjectMappers,
  ): Event<never> {
    return { ...super.view(player, event, mapper), type: "see" };
  }
}
