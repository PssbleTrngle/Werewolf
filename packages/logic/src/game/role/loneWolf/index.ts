import type { Role } from "models";
import { RoleGroup } from "models";

export const LoneWolf: Role = {
  type: "lone_wolf",
  groups: [RoleGroup.WOLF],
  emoji: "🌑",
  impact: -5,
};
