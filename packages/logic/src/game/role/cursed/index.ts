import type { Role } from "models";
import { RoleGroup } from "models";

export const Cursed: Role = {
  type: "cursed",
  groups: [RoleGroup.VILLAGER],
  emoji: "🌒",
  impact: -3,
};
