import { individualEvents, roleScopedFactory } from "../../event/Event.js";
import { registerEvent } from "../../event/EventRegistry.js";
import { RevealEvent } from "../../event/RevealEvent.js";
import { StartEvents } from "../../event/StartEvent.js";
import { hasRole } from "../../player/predicates.js";
import { Seer } from "../seer/index.js";
import { Eye } from "./index.js";

export const registerEyeEvents = (role = Eye, revealedRole = Seer) => {
  registerEvent(`reveal.${role.type}`, new RevealEvent());
  StartEvents.registerEvent(
    roleScopedFactory(role, ({ players }) => {
      const seers = players.filter(hasRole(revealedRole));
      const users = players.filter(hasRole(role));
      return individualEvents(users, (it) =>
        RevealEvent.create(role, it, seers),
      );
    }),
  );
};
