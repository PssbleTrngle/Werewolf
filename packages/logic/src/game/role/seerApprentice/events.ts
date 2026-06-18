import { AnnouncementEvents } from "../../effect/AnnouncementEffect.js";
import { ChangeRoleEffect } from "../../effect/ChangeRoleEffect.js";
import { hasRole, isAlive } from "../../player/predicates.js";
import { Seer } from "../seer/index.js";
import { SeerApprentice } from "./index.js";

export function registerApprenticeEvents(role = SeerApprentice, into = Seer) {
  AnnouncementEvents.register((game) => {
    if (game.players.filter(hasRole(into)).some(isAlive)) return false;

    const [apprentice] = game.players.filter(hasRole(role));
    if (!apprentice) return false;

    return new ChangeRoleEffect(apprentice.id, into);
  });
}
