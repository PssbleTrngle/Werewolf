import { Role } from "./Role";
import { RoleGroup } from "./RoleGroup";

export class Villager extends Role {
  constructor() {
    super([RoleGroup.VILLAGER], "🌾");
  }
}
