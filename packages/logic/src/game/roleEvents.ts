import { SleepBoundary, SleepEvents } from "./event/SleepBoundary.js";
import { isNotDead } from "./player/predicates.js";
import { registerEyeEvents } from "./role/Eye.js";
import { registerSeerEvents } from "./role/Seer.js";
import { registerWitchEvents } from "./role/Witch.js";
import { registerWolfEvents } from "./role/Wolf.js";

registerEyeEvents();

registerSeerEvents();
registerWolfEvents();
registerWitchEvents();

SleepEvents.register(({ players }) =>
  SleepBoundary.create(players.filter(isNotDead))
);
