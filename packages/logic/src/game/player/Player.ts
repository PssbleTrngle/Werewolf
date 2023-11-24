import { Player as IPlayer } from "models";
import { Role } from "../role/Role.js";

export type Status = "alive" | "dead" | "dying";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}
