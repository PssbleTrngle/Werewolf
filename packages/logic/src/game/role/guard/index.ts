import type { Role } from "models";
import { RoleGroup } from "models";

export const Guard: Role = {
  type: "guard",
  groups: [RoleGroup.VILLAGER],
  emoji: "🛡️",
  impact: 3,
};
