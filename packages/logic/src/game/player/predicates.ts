import { Role } from "../role/Role";
import { RoleGroup } from "../role/RoleGroup";
import { Player } from "./Player";

export function inGroup(group: RoleGroup) {
  return (value: Player | Role): boolean => {
    const role = value instanceof Role ? value : value.role;
    return role.groups.includes(group);
  };
}

export function notSelf(self: Player) {
  return (player: Player) => {
    return player.id !== self.id;
  };
}

export function isAlive(player: Player) {
  return player.status === "alive";
}
