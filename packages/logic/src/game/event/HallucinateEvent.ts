import { Event, Role, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { HallucinateEffect } from "../effect/HallucinateEffect.js";
import { SubjectMappers } from "../permissions/index.js";
import { Player } from "../player/Player.js";
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
    })
  );

  finish(vote: Vote, event: Event<undefined>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      return new HallucinateEffect(
        event.role as Role,
        event.players[0].id,
        vote.players
      );
    }

    return [];
  }

  view(
    player: Player,
    event: Event<never>,
    mapper: SubjectMappers
  ): Event<never> {
    return { ...super.view(player, event, mapper), type: "see" };
  }
}
