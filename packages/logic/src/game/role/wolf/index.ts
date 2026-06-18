import type { Role } from "models";
import { RoleGroup } from "models";

export const Werewolf: Role = {
  type: "werewolf",
  groups: [RoleGroup.WOLF],
  emoji: "🐺",
  impact: -6,
};
