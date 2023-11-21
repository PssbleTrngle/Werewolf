import { Role } from "./Role.js";

export type Id = number | string;

export interface Player {
  id: Id;
  name: string;
  role?: Role;
}
