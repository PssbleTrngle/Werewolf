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
  amorCanChooseSelf?: boolean;
  deathRevealType?: PlayerRevealType;
  seerRevealType?: PlayerRevealType;
  loveRevealType?: PlayerRevealType;
  brokenHeartHeals?: boolean;
}
