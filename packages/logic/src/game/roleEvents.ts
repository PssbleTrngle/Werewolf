import { SleepBoundary, SleepEvents } from "./event/SleepBoundary";
import { isAlive } from "./player/predicates";
import { registerEyeEvents } from "./role/Eye";
import { registerSeerEvents } from "./role/Seer";
import { registerWitchEvents } from "./role/Witch";
import { registerWolfEvents } from "./role/Wolf";

registerEyeEvents();

registerSeerEvents();
registerWolfEvents();
registerWitchEvents();

SleepEvents.register(
  ({ players }) => new SleepBoundary(players.filter(isAlive))
);
