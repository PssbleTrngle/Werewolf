import { Role, RoleGroup } from "models";
import { AnnouncementEvents } from "../effect/AnnouncementEffect.js";
import { ChangeRoleEffect } from "../effect/ChangeRoleEffect.js";
import { hasRole, isAlive } from "../player/predicates.js";
import { Seer } from "./Seer.js";

export const SeerApprentice: Role = {
  type: "seer_apprentice",
  groups: [RoleGroup.VILLAGER],
  emoji: "✨",
};

export function registerApprenticeEvents(role = SeerApprentice, into = Seer) {
  AnnouncementEvents.register((game) => {
    if (game.players.filter(hasRole(into)).some(isAlive)) return false;

    const [apprentice] = game.players.filter(hasRole(role));
    if (!apprentice) return false;

    return new ChangeRoleEffect(apprentice.id, into);
  });
}
