import { Player as IPlayer, Role, Status } from "models";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}
