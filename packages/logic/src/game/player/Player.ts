import { Id, Player as IPlayer, Role, Status } from "models";

export interface RoleData {
  usedRevivePotion?: boolean;
  usedKillPotion?: boolean;
  target?: Id;
  revealedPlayers?: Record<Id, IPlayer>;
  hallucinated?: Record<Id, Partial<IPlayer>>;
  loves?: Id;
  guarding?: Id;
}

export interface Player extends IPlayer {
  role: Role;
  status: Status;
  roleData: RoleData;
}
