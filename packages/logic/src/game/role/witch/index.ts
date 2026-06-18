import type { Role } from "models";
import { RoleGroup } from "models";

export const Witch: Role = {
  type: "witch",
  groups: [RoleGroup.VILLAGER],
  emoji: "🧹",
  impact: 4,
};
