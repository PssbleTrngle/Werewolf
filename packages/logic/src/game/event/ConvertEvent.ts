import type { ConvertData, Event, RevealData } from "models";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";

export class ConvertEvent extends EventType<RevealData> {
  static create(type: string, player: Player): Event<ConvertData> {
    return {
      players: [player],
      type: `convert.${type}`,
      choice: DismissChoice,
      data: { player },
    };
  }

  finish() {
    return [];
  }

  protected viewData(
    _player: Player,
    subject: RevealData,
    _mapper: SubjectMappers,
  ): RevealData {
    // TODO only reveal role/role group depending on setting
    return subject;
  }
}
