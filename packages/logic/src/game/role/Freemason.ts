import { Role, RoleGroup } from "models";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";

export const Freemason: Role = {
  type: "freemason",
  groups: [RoleGroup.VILLAGER],
  emoji: "⚒️",
};

export function registerFreemasonEvents(role = Freemason.type) {
  registerEvent(`reveal.${role}`, new RevealEvent());
  StartEvents.registerEvent(({ players }) => {
    const comrades = players.filter(hasRole(role));
    return RevealEvent.create("freemason", comrades, comrades);
  });
}
