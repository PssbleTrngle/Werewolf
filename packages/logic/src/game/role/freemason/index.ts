import type { Role } from "models";
import { RoleGroup } from "models";

export const Freemason: Role = {
  type: "freemason",
  groups: [RoleGroup.VILLAGER],
  emoji: "⚒️",
  impact: +2,
};
