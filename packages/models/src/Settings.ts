export const enum PlayerRevealType {
  ROLE = "role",
  GROUP = "group",
  ALIGNMENT = "alignment",
  NOTHING = "nothing",
}

export interface GameSettings {
  lynchSkippable: boolean;
  disabledRoles: string[];
  fakePlayerScreens: boolean;
  deathRevealType: PlayerRevealType;
  seerRevealType: PlayerRevealType;
  loveRevealType: PlayerRevealType;
  amorCanChooseSelf: boolean;
  brokenHeartHeals: boolean;
  guardCanChooseSelf: boolean;
}

export const defaultGameSettings: GameSettings = {
  lynchSkippable: true,
  disabledRoles: [],
  fakePlayerScreens: false,
  seerRevealType: PlayerRevealType.ALIGNMENT,
  deathRevealType: PlayerRevealType.NOTHING,
  loveRevealType: PlayerRevealType.ROLE,
  amorCanChooseSelf: true,
  brokenHeartHeals: false,
  guardCanChooseSelf: true,
};
