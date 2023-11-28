import { SleepBoundary, SleepEvents } from "./event/SleepBoundary.js";
import { isNotDead } from "./player/predicates.js";
import { registerEyeEvents } from "./role/Eye.js";
import { registerHunterEvents } from "./role/Hunter.js";
import { registerSeerEvents } from "./role/Seer.js";
import { registerWitchEvents } from "./role/Witch.js";
import { registerWolfEvents } from "./role/Wolf.js";

registerEyeEvents();

registerSeerEvents();
registerWolfEvents();
registerWitchEvents();

registerHunterEvents();

SleepEvents.register(({ players }) =>
  SleepBoundary.create(players.filter(isNotDead))
);
