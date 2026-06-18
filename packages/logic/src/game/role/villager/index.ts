import type { Role } from "models";
import { RoleGroup } from "models";

export const Villager: Role = {
  type: "villager",
  groups: [RoleGroup.VILLAGER],
  emoji: "🌾",
  impact: 1,
};
