import { Id, Player, Role, RoleGroup } from "models";

export function inGroup(group: RoleGroup) {
  return (value: Player): boolean => {
    return value.role?.groups?.includes(group) ?? false;
  };
}

export function others(...self: Player[]) {
  return (player: Player) => {
    return self.every((it) => player.id !== it.id);
  };
}

export function isNotDead(player: Player) {
  return isAlive(player) || isDying(player);
}

export function isAlive(player: Player) {
  return player.status === "alive";
}

export function isDying(player: Player) {
  return player.status === "dying";
}

export function hasRole(role: string | Role) {
  const type = typeof role === "string" ? role : role.type;
  return (player: Player) => player.role?.type === type;
}

export function byId(id: Id) {
  return (player: Player) => player.id === id;
}

export function requirePlayer<T extends Player>(
  players: ReadonlyArray<T>,
  id: Id
): T {
  const match = players.find(byId(id));
  if (match) return match;
  throw new Error(`Unknown Player with ID '${id}'`);
}
