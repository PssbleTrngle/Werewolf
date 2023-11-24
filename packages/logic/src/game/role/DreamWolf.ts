import { Role } from "./Role.js";
import { RoleGroup } from "./RoleGroup.js";

export class DreamWolf extends Role {
  constructor() {
    super("dreamwolf", [RoleGroup.WOLF], "🌖");
  }
}
