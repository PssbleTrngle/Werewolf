import { Player as IPlayer } from "models";
import { Role } from "../role/Role.js";

export type Status = "alive" | "dead";

export interface Player extends IPlayer {
  role: Role;
  status: Status;
}
