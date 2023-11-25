import { times } from "lodash-es";
import { Player } from "../../src/game/player/Player.js";
import { Villager } from "../../src/game/role/Villager.js";
import { Role } from "../../src/index.js";

export function createTestPlayers(
  amount: number,
  factory: (index: number) => Partial<Player> = () => ({}),
) {
  return times<Player>(amount, (id) => {
    const { role = new Villager(), ...rest } = factory(id);
    return {
      id,
      role,
      status: "alive",
      name: `Player ${id} [${role.emoji}]`,
      roleData: {},
      ...rest,
    };
  });
}

export function createTestPlayersWith(roles: Role[]) {
  return createTestPlayers(roles.length, (i) => ({ role: roles[i] }));
}
