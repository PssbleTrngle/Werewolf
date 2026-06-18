import type { Role } from "models";
import { RoleGroup } from "models";

export const Eye: Role = {
  type: "eye",
  groups: [RoleGroup.VILLAGER],
  emoji: "👁️",
  impact: 2,
};
