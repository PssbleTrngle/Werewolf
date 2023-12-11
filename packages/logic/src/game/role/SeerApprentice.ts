import { Role, RoleGroup } from "models";

export const SeerApprentice: Role = {
  type: "seer_apprentice",
  groups: [RoleGroup.VILLAGER],
  emoji: "✨",
};
