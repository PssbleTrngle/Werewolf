import { Role as IRole } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { Player } from "../player/Player.js";
import { RoleGroup } from "./RoleGroup.js";

export class Role implements IRole {
  constructor(
    public readonly type: string,
    public readonly groups: ReadonlyArray<RoleGroup>,
    public readonly emoji: string,
  ) {}

  onDeath(_self: Player): ArrayOrSingle<Effect> {
    return [];
  }
}
