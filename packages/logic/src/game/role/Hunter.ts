import { isAlive, notSelf } from "../../player/predicates";
import { Player } from "../Player";
import { EventEffect } from "../effect/EventEffect";
import { KillEvent } from "../event/KillEvent";
import { Role } from "./Role";
import { RoleGroup } from "./RoleGroup";

export class Hunter extends Role {
  constructor() {
    super([RoleGroup.VILLAGER], "🔫");
  }

  onDeath(self: Player) {
    return new EventEffect((players) => {
      const targets = players.filter(isAlive).filter(notSelf(self));
      return new KillEvent([self], "getting shot", { players: targets });
    });
  }
}
