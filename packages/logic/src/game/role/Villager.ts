import { Role, RoleGroup } from "models";

export const Villager: Role = {
  type: "villager",
  groups: [RoleGroup.VILLAGER],
  emoji: "🌾",
};
