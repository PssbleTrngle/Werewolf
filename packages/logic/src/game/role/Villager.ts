import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class Villager extends Role {
  constructor() {
    super("villager", [RoleGroup.VILLAGER], "🌾");
  }
}
