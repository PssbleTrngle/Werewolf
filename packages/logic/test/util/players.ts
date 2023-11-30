import { times } from "lodash-es";
import { Role } from "models";
import { EMPTY_ROLE_DATA, Player } from "../../src/game/player/Player.js";
import { Villager } from "../../src/game/role/Villager.js";

export function createTestPlayers(
  amount: number,
  factory: (index: number) => Partial<Player> = () => ({})
) {
  return times<Player>(amount, (id) => {
    const { role = Villager, ...rest } = factory(id);
    return {
      id: `${id}`,
      role,
      status: "alive",
      name: `Player ${id} [${role.emoji}]`,
      roleData: EMPTY_ROLE_DATA,
      ...rest,
    };
  });
}

export function createTestPlayersWith(roles: Role[]) {
  return createTestPlayers(roles.length, (i) => ({ role: roles[i] }));
}
