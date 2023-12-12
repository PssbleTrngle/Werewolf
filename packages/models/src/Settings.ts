export const enum PlayerRevealType {
  ROLE = "role",
  GROUP = "group",
  ALIGNMENT = "alignment",
  NOTHING = "nothing",
}

export interface GameSettings {
  disableLynchSkip?: boolean;
  disabledRoles?: string[];
  fakePlayerScreens?: boolean;
  deathRevealType?: PlayerRevealType;
  seerRevealType?: PlayerRevealType;
}
