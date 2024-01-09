import { Role } from "./Role.js";

export type Id = string;

export type Status = "alive" | "dead" | "dying";

export const enum DeathCause {
  LYNCHED = "lynched",
  WOLFS = "wolfs",
  HUNTER = "hunter",
  POTION = "potion",
  BROKEN_HEART = "broken_heart",
}

export interface User {
  id: Id;
  name?: string;
  provider?: string;
}

export interface Player extends User {
  role?: Partial<Role>;
  deathCause?: DeathCause;
  status?: Status;
}
