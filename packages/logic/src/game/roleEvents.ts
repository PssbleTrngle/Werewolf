import { SleepBoundary, SleepEvents } from "./event/SleepBoundary.js";
import { isNotDead } from "./player/predicates.js";
import { registerCursedEvents } from "./role/Cursed.js";
import {
  registerExecutionerWinCondition,
  registerExecutionEvents,
} from "./role/Executioner.js";
import { registerEyeEvents } from "./role/Eye.js";
import { registerFreemasonEvents } from "./role/Freemason.js";
import { registerHunterEvents } from "./role/Hunter.js";
import { registerJesterWinCondition } from "./role/Jester.js";
import { registerSeerEvents } from "./role/Seer.js";
import { registerApprenticeEvents } from "./role/SeerApprentice.js";
import { registerVillagerWinCondition } from "./role/Villager.js";
import { registerWitchEvents } from "./role/Witch.js";
import { registerWolfEvents, registerWolfWinCondition } from "./role/Wolf.js";
import { registerLoneWolfWinCondition } from "./role/LoneWolf.js";
import { registerAmorEvents, registerLoversWinCondition } from "./role/Amor.js";

registerExecutionEvents();
registerEyeEvents();
registerFreemasonEvents();
registerAmorEvents();

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
