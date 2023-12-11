import { RoleGroup } from "models";
import { MIN_PLAYERS, generateRoles, inGroup } from "../src/index.js";
import { createTestPlayers } from "./util/players.js";

it("role selector returns correct count", () => {
  for (let amount = MIN_PLAYERS; amount < 30; amount++) {
    const players = createTestPlayers(amount);
    const roles = generateRoles(players);

    const wolfs = roles.filter(inGroup(RoleGroup.WOLF));
    const villagers = roles.filter(inGroup(RoleGroup.VILLAGER));
    expect(roles).toHaveLength(players.length);
    expect(wolfs.length).greaterThan(0);
    expect(villagers.length).greaterThan(0);
  }
});
