import { times } from "lodash-es";
import type { Role } from "models";
import type { Player } from "../../src/game/player/Player.js";
import { Villager } from "../../src/game/role/villager/index.js";

export function createTestPlayers(
  amount: number,
  factory: (index: number) => Partial<Player> = () => ({}),
) {
  return times<Player>(amount, (id) => {
    const { role = Villager, ...rest } = factory(id);
    return {
      id: `${id}`,
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
