import { shuffle, times } from "lodash-es";
import { Role } from "models";
import { Player } from "./player/Player.js";
import { DreamWolf } from "./role/DreamWolf.js";
import { Eye } from "./role/Eye.js";
import { Hunter } from "./role/Hunter.js";
import { Jester } from "./role/Jester.js";
import { Seer } from "./role/Seer.js";
import { Villager } from "./role/Villager.js";
import { Witch } from "./role/Witch.js";
import { Werewolf } from "./role/Wolf.js";

export const MIN_PLAYERS = 5;

export const allRoles: Role[] = [
  Seer,
  Eye,
  Hunter,
  Witch,
  Jester,
  Werewolf,
  DreamWolf,
];

export function generateRoles(
  players: ReadonlyArray<Omit<Player, "role">>,
  // TODO use
  isEnabled: (role: Role) => boolean = () => true
): ReadonlyArray<Player> {
  const count = players.length;
  if (count < MIN_PLAYERS) throw new Error("Not enough players");

  const specialWolfs = [DreamWolf].filter(isEnabled);

  const wolfCount = Math.floor(count / 3);
  const wolfs: Role[] = times(
    Math.max(1, wolfCount - specialWolfs.length),
    () => Werewolf
  );

  if (wolfCount > 1) wolfs.push(...specialWolfs);

  const specialRoles: Role[] = shuffle([Seer, Eye, Hunter, Witch, Jester])
    .filter(isEnabled)
    .slice(0, Math.max(0, count - wolfs.length));

  const roles: Role[] = shuffle([
    ...wolfs,
    ...specialRoles,
    ...times(count - specialRoles.length - wolfs.length, () => Villager),
  ]);

  if (roles.length !== players.length) {
    throw new Error("something went wrong in the role selector");
  }

  return players.map((it, i) => ({ ...it, role: roles[i] }));
}
