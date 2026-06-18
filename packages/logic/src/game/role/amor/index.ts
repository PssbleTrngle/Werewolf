import type { Role } from "models";
import { RoleGroup } from "models";

export const Amor: Role = {
  type: "amor",
  groups: [RoleGroup.VILLAGER],
  emoji: "💘",
  impact: -3,
};
