export const enum RoleGroup {
  // These are only used for alignment reveals
  GOOD = "good",
  EVIL = "evil",

  WOLF = "wolf",
  VILLAGER = "villager",
}

export interface Role {
  type: string;
  emoji: string;
  impact: number;
  groups?: ReadonlyArray<RoleGroup>;
  variants?: string[];
  variant?: string;
}
