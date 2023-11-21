import { shuffle, times } from "lodash-es";
import { Player } from "./player/Player.js";
import { Eye } from "./role/Eye.js";
import { Hunter } from "./role/Hunter.js";
import { Role } from "./role/Role.js";
import { Seer } from "./role/Seer.js";
import { Villager } from "./role/Villager.js";
import { Werewolf } from "./role/Wolf.js";

export function generateRoles(
  players: ReadonlyArray<Omit<Player, "role">>
): ReadonlyArray<Player> {
  const count = players.length;
  if (count < 5) throw new Error("Not enough players");

  const specialRoles: Role[] = [
    new Seer(),
    new Eye(),
    new Hunter(),
    ...times(Math.floor(count / 3), () => new Werewolf()),
  ];

  const roles: Role[] = shuffle([
    ...specialRoles,
    ...times(count - specialRoles.length, () => new Villager()),
  ]);

  return players.map((it, i) => ({ ...it, role: roles[i] }));
}
