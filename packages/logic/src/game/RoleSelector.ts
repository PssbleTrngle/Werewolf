import { shuffle, times } from "lodash-es";
import { ApiError, GameSettings, Role, User } from "models";
import { EMPTY_ROLE_DATA, Player, RoleData } from "./player/Player.js";
import { Cursed } from "./role/Cursed.js";
import { DreamWolf } from "./role/DreamWolf.js";
import { Executioner } from "./role/Executioner.js";
import { Eye } from "./role/Eye.js";
import { Freemason } from "./role/Freemason.js";
import { Hunter } from "./role/Hunter.js";
import { Jester } from "./role/Jester.js";
import { LoneWolf } from "./role/LoneWolf.js";
import { Fool, Seer } from "./role/Seer.js";
import { SeerApprentice } from "./role/SeerApprentice.js";
import { Villager } from "./role/Villager.js";
import { Witch } from "./role/Witch.js";
import { Werewolf } from "./role/Wolf.js";
import { EventBus } from "./event/EventBus.js";
import { others } from "./player/predicates.js";
import { Amor } from "./role/Amor.js";
import { WolfCub } from './role/WolfCub.js';

export const MIN_PLAYERS = 5;

export const allRoles: Role[] = [
  Villager,
  Seer,
  Eye,
  Hunter,
  Witch,
  Jester,
  Executioner,
  Werewolf,
  DreamWolf,
  WolfCub,
  Freemason,
  Fool,
  Cursed,
  SeerApprentice,
  LoneWolf,
  Amor,
];

type InitialPlayer = Omit<Player, "roleData" | "status">;
export const InitialDataEvents = new EventBus<
  (
    player: InitialPlayer,
    others: InitialPlayer[],
    settings: GameSettings,
  ) => Partial<RoleData> | false
>();

export function generateRoles(
  players: ReadonlyArray<User>,
  settings: GameSettings = {},
): ReadonlyArray<InitialPlayer> {
  const count = players.length;
  if (count < MIN_PLAYERS) throw new ApiError(400, "Not enough players");

  const isEnabled = (role: Role) =>
    !settings.disabledRoles?.includes(role.type);

  const specialWolfs = [DreamWolf, LoneWolf, WolfCub].filter(isEnabled);

  const wolfCount = Math.floor(count / 3);
  const wolfs: Role[] = times(
    Math.max(1, wolfCount - specialWolfs.length),
    () => Werewolf,
  );

  if (wolfCount > 1) wolfs.push(...specialWolfs);

  const specialRoles: Role[] = shuffle([
    Seer,
    Fool,
    Eye,
    Hunter,
    Witch,
    Jester,
    Executioner,
    Cursed,
    SeerApprentice,
    Amor,
  ])
    .filter(isEnabled)
    .slice(0, Math.max(0, count - wolfs.length));

  const villagerCount = count - specialRoles.length - wolfs.length;

  const minFreemasons = 2;
  const maxFreemasons = Math.min(villagerCount, 3);
  const generateFreemasons =
    isEnabled(Freemason) &&
    maxFreemasons >= minFreemasons &&
    Math.random() > 0.4;

  const freeMasons = generateFreemasons
    ? times(
        Math.round(
          minFreemasons + (maxFreemasons - minFreemasons) * Math.random(),
        ),
        () => Freemason,
      )
    : [];

  const roles: Role[] = shuffle([
    ...wolfs,
    ...specialRoles,
    ...freeMasons,
    ...times(villagerCount - freeMasons.length, () => Villager),
  ]);

  if (roles.length !== players.length) {
    throw new Error("something went wrong in the role selector");
  }

  const indizes = shuffle(times(players.length, (i) => i));

  return players.map((it, i) => {
    const role = roles[i];
    const variant =
      role.variants && role.variants[indizes[i] % role.variants.length];
    return { ...it, role, variant };
  });
}

export function preparePlayers(
  players: ReadonlyArray<User>,
  settings: GameSettings = {},
): ReadonlyArray<Player> {
  const withRoles = generateRoles(players, settings);

  return withRoles.map((it) => {
    const roleData = InitialDataEvents.notify(
      it,
      withRoles.filter(others(it)),
      settings,
    ).reduce<RoleData>((a, b) => ({ ...a, ...b }), EMPTY_ROLE_DATA);

    return {
      ...it,
      status: "alive",
      roleData,
    };
  });
}
