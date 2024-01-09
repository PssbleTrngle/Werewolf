import { Role, RoleGroup } from "models";
import { roleScopedFactory } from "../event/Event.js";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole } from "../player/predicates.js";

export const Freemason: Role = {
  type: "freemason",
  groups: [RoleGroup.VILLAGER],
  emoji: "⚒️",
  impact: +2,
};

export function registerFreemasonEvents(role = Freemason) {
  registerEvent(`reveal.${role.type}`, new RevealEvent());
  StartEvents.registerEvent(
    roleScopedFactory(role, ({ players }) => {
      const comrades = players.filter(hasRole(role));
      return RevealEvent.create(role, comrades, comrades);
    })
  );
}
