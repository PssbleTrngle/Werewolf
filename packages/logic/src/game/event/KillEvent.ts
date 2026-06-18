import type { Event, KillData, Vote } from "models";
import type { ArrayOrSingle } from "../../util.js";
import type { Effect } from "../effect/Effect.js";
import { KillEffect } from "../effect/KillEffect.js";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import { EventType } from "./Event.js";

export class KillEvent extends EventType<KillData> {
  finish(vote: Vote, { data }: Event<KillData>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      return vote.players.map((it) => new KillEffect(it, data.cause));
    }

    return [];
  }

  protected viewData(
    _player: Player,
    subject: KillData,
    _mapper: SubjectMappers,
  ): KillData {
    // TODO hide death cause depending on setting
    return subject;
  }
}
