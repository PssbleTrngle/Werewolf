import type { Role} from "models";
import { RoleGroup } from "models";

export const DreamWolf: Role = {
  type: "dreamwolf",
  groups: [RoleGroup.WOLF],
  emoji: "🌖",
  impact: -5,
};
