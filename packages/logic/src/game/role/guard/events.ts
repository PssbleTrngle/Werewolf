import type { Player } from "models";
import { DeathCause } from "models";
import { ProtectEvents } from "../../event/DeathEvent.js";
import { roleScopedFactory } from "../../event/Event.js";
import GuardEvent from "../../event/GuardEvent.js";
import { SleepEvents } from "../../event/SleepBoundary.js";
import { hasRole, isAlive, others } from "../../player/predicates.js";
import { Guard } from "./index.js";

const protectsAgainst: DeathCause[] = [DeathCause.WOLFS, DeathCause.HUNTER];

export function registerGuardEvents(role = Guard) {
  SleepEvents.registerEvent(
    roleScopedFactory(role, ({ players, settings }) => {
      const alive = players.filter(isAlive);
      const guards = alive.filter(hasRole(role));

      if (guards.length === 0) {
        return GuardEvent.create([], alive);
      }

      return guards.map((it) => {
        const blocked: Pick<Player, "id">[] = [];

        const previous = it.roleData.guarding;
        if (previous) blocked.push({ id: previous });

        if (!settings.guardCanChooseSelf) blocked.push(it);

        const choices = alive.filter(others(...blocked));
        return GuardEvent.create([it], choices);
      });
    }),
  );

  ProtectEvents.register((player, cause, game) => {
    if (!protectsAgainst.includes(cause)) return false;
    const guard = game.players
      .filter(isAlive)
      .filter(hasRole(role))
      .find((it) => it.roleData.guarding === player.id);

    return !!guard;
  });
}
