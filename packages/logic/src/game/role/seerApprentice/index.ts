import type { Role } from "models";
import { RoleGroup } from "models";

export const SeerApprentice: Role = {
  type: "seer_apprentice",
  groups: [RoleGroup.VILLAGER],
  emoji: "✨",
  impact: 4,
};
