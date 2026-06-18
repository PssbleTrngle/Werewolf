import type { Event, FakeData, Vote } from "models";
import type { ArrayOrSingle } from "../../util.js";
import type { Effect } from "../effect/Effect.js";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";
import { EventRegistry, registerEventFactory } from "./EventRegistry.js";

export class FakeEvent extends EventType<FakeData> {
  static create = registerEventFactory(
    "fake",
    new FakeEvent(),
    (data: FakeData, requiresInput: boolean) => {
      if (!requiresInput) return { data };
      return {
        data,
        choice: DismissChoice,
      };
    },
  );

  finish(_vote: Vote, { data }: Event<FakeData>): ArrayOrSingle<Effect> {
    const fakedType = EventRegistry.get(data.type);
    return fakedType.finish({ type: "skip" }, { ...data, players: [] });
  }

  protected viewData(
    _player: Player,
    subject: FakeData,
    _mapper: SubjectMappers,
  ): FakeData {
    return subject;
  }
}
