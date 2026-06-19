import type { Role } from "models";
import { RoleGroup } from "models";

export const WolfCub: Role = {
  type: "cub",
  groups: [RoleGroup.WOLF],
  emoji: "🐶",
  impact: -8,
};
