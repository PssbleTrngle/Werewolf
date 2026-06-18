import type { Role } from "models";
import { RoleGroup } from "models";

export const Seer: Role = {
  type: "seer",
  groups: [RoleGroup.VILLAGER],
  emoji: "🔮",
  variants: ["male", "female"],
  impact: 7,
};

export const Fool: Role = {
  type: "fool",
  groups: [RoleGroup.VILLAGER],
  emoji: "🤡",
  impact: -2,
};
