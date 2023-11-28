import { Player as IPlayer, Id, Role, Status } from "models";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
  target?: Id;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}
