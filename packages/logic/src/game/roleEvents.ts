import { SleepBoundary, SleepEvents } from "./event/SleepBoundary.js";
import { isNotDead } from "./player/predicates.js";
import {
  registerExecutionEvents,
  registerExecutionerWinCondition,
} from "./role/Executioner.js";
import { registerEyeEvents } from "./role/Eye.js";
import { registerFreemasonEvents } from "./role/Freemason.js";
import { registerHunterEvents } from "./role/Hunter.js";
import { registerJesterWinCondition } from "./role/Jester.js";
import { registerSeerEvents } from "./role/Seer.js";
import { registerVillagerWinCondition } from "./role/Villager.js";
import { registerWitchEvents } from "./role/Witch.js";
import { registerWolfEvents, registerWolfWinCondition } from "./role/Wolf.js";

registerExecutionEvents();
registerEyeEvents();
registerFreemasonEvents();

registerSeerEvents();
registerWolfEvents();
registerWitchEvents();

registerHunterEvents();

SleepEvents.registerEvent(({ players }) =>
  SleepBoundary.create(players.filter(isNotDead))
);

registerJesterWinCondition();
registerExecutionerWinCondition();
registerWolfWinCondition();
registerVillagerWinCondition();
