import { Player as IPlayer, Status } from "models";
import { Role } from "../role/Role.js";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}
