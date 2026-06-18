import type { Role } from "models";
import { RoleGroup } from "models";

export const Hunter: Role = {
  type: "hunter",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔫",
  impact: 3,
};
