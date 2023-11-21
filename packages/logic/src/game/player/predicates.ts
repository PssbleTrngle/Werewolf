import { Role } from "../role/Role.js";
import { RoleGroup } from "../role/RoleGroup.js";
import { Player } from "./Player.js";

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

export function hasRole(role: string) {
  return (player: Player) => player.role.type === role;
}
