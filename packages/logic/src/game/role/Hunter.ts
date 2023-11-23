import { EventEffect } from "../effect/EventEffect.js";
import { KillEvent } from "../event/KillEvent.js";
import { Player } from "../player/Player.js";
import { isAlive, notSelf } from "../player/predicates.js";
import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Hunter extends Role {
  constructor() {
    super("hunter", [RoleGroup.VILLAGER], "🔫");
  }

  onDeath(self: Player) {
    return new EventEffect(({ players }) => {
      const targets = players.filter(isAlive).filter(notSelf(self));
      return new KillEvent("kill.hunter", [self], "getting shot", {
        players: targets,
      });
    }, true);
  }
}
