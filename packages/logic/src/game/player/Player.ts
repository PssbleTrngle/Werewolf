import { Player as IPlayer, Id, Role, Status } from "models";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
  target?: Id;
  revealedPlayers: Record<Id, IPlayer>;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}

export const EMPTY_ROLE_DATA: RoleData = {
  revealedPlayers: {},
};
