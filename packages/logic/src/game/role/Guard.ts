import { DeathCause, Player, Role, RoleGroup } from "models";
import { hasRole, isAlive, others } from "../player/predicates.js";
import { SleepEvents } from "../event/SleepBoundary.js";
import GuardEvent from "../event/GuardEvent.js";
import { ProtectEvents } from '../event/DeathEvent.js';

export const Guard: Role = {
  type: "guard",
  groups: [RoleGroup.VILLAGER],
  emoji: "🛡️",
  impact: 3,
};

const protectsAgainst: DeathCause[] = [DeathCause.WOLFS, DeathCause.HUNTER];

export function registerGuardEvents(role = Guard) {
  SleepEvents.registerEvent(({ players, settings }) => {
    const alive = players.filter(isAlive);
    const guards = alive.filter(hasRole(role));

    return guards.map((it) => {
      const blocked: Pick<Player, "id">[] = [];

      const previous = it.roleData.guarding;
      if (previous) blocked.push({ id: previous });

      if (!settings.guardCanChooseSelf) blocked.push(it);

      const choices = alive.filter(others(...blocked));
      return GuardEvent.create([it], choices);
    });
  });

  ProtectEvents.register((player, cause, game) => {
    if (!protectsAgainst.includes(cause)) return false;
    const guard = game.players
      .filter(isAlive)
      .filter(hasRole(role))
      .find((it) => it.roleData.guarding === player.id);

    return !!guard;
  });
}
