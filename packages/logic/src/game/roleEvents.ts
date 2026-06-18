import { SleepBoundary, SleepEvents } from "./event/SleepBoundary.js";
import { isNotDead } from "./player/predicates.js";
import {
  registerAmorEvents,
  registerLoversWinCondition,
} from "./role/amor/events.js";
import { registerCursedEvents } from "./role/cursed/events.js";
import {
  registerExecutionerWinCondition,
  registerExecutionEvents,
} from "./role/executioner/events.js";
import { registerEyeEvents } from "./role/eye/events.js";
import { registerFreemasonEvents } from "./role/freemason/events.js";
import { registerGuardEvents } from "./role/guard/events.js";
import { registerHunterEvents } from "./role/hunter/events.js";
import { registerJesterWinCondition } from "./role/jester/events.js";
import { registerLoneWolfWinCondition } from "./role/loneWolf/events.js";
import { registerSeerEvents } from "./role/seer/events.js";
import { registerApprenticeEvents } from "./role/seerApprentice/events.js";
import { registerVillagerWinCondition } from "./role/villager/events.js";
import { registerWitchEvents } from "./role/witch/events.js";
import {
  registerWolfEvents,
  registerWolfWinCondition,
} from "./role/wolf/events.js";

registerAmorEvents();
registerExecutionEvents();
registerEyeEvents();
registerFreemasonEvents();

registerGuardEvents();
registerSeerEvents();
registerWolfEvents();
registerCursedEvents();
registerApprenticeEvents();
registerWitchEvents();

registerHunterEvents();

SleepEvents.registerEvent(({ players }) =>
  SleepBoundary.create(players.filter(isNotDead)),
);

registerJesterWinCondition();
registerExecutionerWinCondition();

registerLoversWinCondition();
registerLoneWolfWinCondition();

registerWolfWinCondition();
registerVillagerWinCondition();
