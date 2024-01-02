import { Event, FakeData, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { SubjectMappers } from "../permissions/index.js";
import { Player } from "../player/Player.js";
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
