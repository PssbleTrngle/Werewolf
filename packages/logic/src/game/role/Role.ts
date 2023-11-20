import { ArrayOrSingle } from "../../util";
import { Effect } from "../effect/Effet";
import { Player } from "../player/Player";
import { RoleGroup } from "./RoleGroup";

export class Role {
  constructor(
    public readonly groups: ReadonlyArray<RoleGroup>,
    public readonly emoji: string
  ) {}

  onDeath(self: Player): ArrayOrSingle<Effect> {
    return [];
  }
}
