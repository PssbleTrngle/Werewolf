import { times } from "lodash-es";
import { Player } from "../../src/game/player/Player";
import { Villager } from "../../src/game/role/Villager";

export function createTestPlayers(
  amount: number,
  factory: (index: number) => Partial<Player> = () => ({})
) {
  return times<Player>(amount, (id) => {
    const { role = new Villager(), ...rest } = factory(id);
    return {
      id,
      role,
      status: "alive",
      name: `Player ${id} [${role.emoji}]`,
      ...rest,
    };
  });
}
