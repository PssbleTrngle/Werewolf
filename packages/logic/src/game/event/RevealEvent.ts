import { Event, RevealData, Vote } from "models";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { SubjectMappers } from "../permissions/index.js";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";

export class RevealEvent extends EventType<RevealData> {
  static create(
    type: string,
    players: ReadonlyArray<Player>,
    targets: ReadonlyArray<Player>
  ): Event<RevealData> {
    return {
      players,
      type: `reveal.${type}`,
      choice: DismissChoice,
      data: { targets },
    };
  }

  finish(_vote: Vote, event: Event<RevealData>) {
    // TODO only if game setting to remember is set
    // TODO only reveal role/role group depending on setting
    return event.players.map(
      (it) =>
        new PlayerDataEffect(it.id, (data) => ({
          revealedPlayers: {
            ...data.revealedPlayers,
            ...Object.fromEntries(event.data.targets.map((it) => [it.id, it])),
          },
        }))
    );
  }

  protected viewData(
    _player: Player,
    subject: RevealData,
    _mapper: SubjectMappers
  ): RevealData {
    // TODO only reveal role/role group depending on setting
    return subject;
  }
}
