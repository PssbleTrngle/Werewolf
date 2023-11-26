import { Role } from "./Role.js";

export type Id = number | string;

export const enum DeathCause {
  LYNCHED = "lynched",
  WOLFS = "wolfs",
  HUNTER = "hunter",
  POTION = "potion",
}

export interface Player {
  id: Id;
  name: string;
  role?: Role;
  deathCause?: DeathCause;
}
