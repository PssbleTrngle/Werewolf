import { Role } from "../role/Role";

export type Status = "alive" | "dead";

export interface Player {
  id: unknown;
  name: string;
  role: Role;
  status: Status;
}
