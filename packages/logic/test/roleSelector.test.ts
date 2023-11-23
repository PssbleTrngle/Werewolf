import { Werewolf } from "../src/game/role/Wolf.js";
import { Hunter, RoleGroup, generateRoles, inGroup } from "../src/index.js";
import { createTestPlayers } from "./util/players.js";

const players = createTestPlayers(5, (i) => {
  const role = i === 0 ? new Hunter() : new Werewolf();
  return { role };
});

it("role selector returns correct count", () => {
  for (let amount = 5; amount < 30; amount++) {
    const players = createTestPlayers(amount);
    const roles = generateRoles(players);

    const wolfs = roles.filter(inGroup(RoleGroup.WOLF));
    const villagers = roles.filter(inGroup(RoleGroup.VILLAGER));
    expect(roles).toHaveLength(players.length);
    expect(wolfs.length).greaterThan(0);
    expect(villagers.length).greaterThan(0);
  }
});
