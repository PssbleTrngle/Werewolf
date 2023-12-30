export const enum RoleGroup {
  WOLF = "wolf",
  VILLAGER = "villager",
}

export interface Role {
  type: string;
  emoji: string;
  groups?: ReadonlyArray<RoleGroup>;
  variants?: string[]
}
