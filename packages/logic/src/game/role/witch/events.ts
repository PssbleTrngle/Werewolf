import { individualEvents } from "../../event/Event.js";
import { SleepEvents } from "../../event/SleepBoundary.js";
import { WitchTrigger } from "../../event/WitchTrigger.js";
import { hasRole, isAlive } from "../../player/predicates.js";
import { Witch } from "./index.js";

export const registerWitchEvents = (role = Witch) =>
  SleepEvents.registerEvent(({ players }) => {
    const witches = players.filter(isAlive).filter(hasRole(role));
    return individualEvents(witches, (it) => WitchTrigger.create(it));
  });
