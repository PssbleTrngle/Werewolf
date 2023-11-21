import { Id } from "models";
import { Role } from "../role/Role.js";

export type Status = "alive" | "dead";

export interface Player {
  id: Id;
  name: string;
  role: Role;
  status: Status;
}
