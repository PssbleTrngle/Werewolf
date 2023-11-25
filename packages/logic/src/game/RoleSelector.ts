import { shuffle, times } from "lodash-es";
import { Player } from "./player/Player.js";
import { DreamWolf } from "./role/DreamWolf.js";
import { Eye } from "./role/Eye.js";
import { Hunter } from "./role/Hunter.js";
import { Role } from "./role/Role.js";
import { Seer } from "./role/Seer.js";
import { Villager } from "./role/Villager.js";
import { Witch } from "./role/Witch.js";
import { Werewolf } from "./role/Wolf.js";

export function generateRoles(
  players: ReadonlyArray<Omit<Player, "role">>,
): ReadonlyArray<Player> {
  const count = players.length;
  if (count < 5) throw new Error("Not enough players");

  const wolfCount = Math.floor(count / 3);
  const wolfs: Role[] = times(Math.max(1, wolfCount - 1), () => new Werewolf());

  if (wolfCount > 1) wolfs.push(new DreamWolf());

  const specialRoles: Role[] = shuffle([
    new Seer(),
    new Eye(),
    new Hunter(),
    new Witch(),
  ]).slice(0, Math.max(0, count - wolfs.length));

  const roles: Role[] = shuffle([
    ...wolfs,
    ...specialRoles,
    ...times(count - specialRoles.length - wolfs.length, () => new Villager()),
  ]);

  if (roles.length !== players.length) {
    throw new Error("something went wrong in the role selector");
  }

  return players.map((it, i) => ({ ...it, role: roles[i] }));
}
