import { DeathCause, Role, RoleGroup } from "models";
import { StartEvents } from "../event/StartEvent.js";
import { hasRole, isAlive, others } from "../player/predicates.js";
import AmorEvent from "../event/AmorEvent.js";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { DeathEvents } from "../event/DeathEvent.js";
import { KillEffect } from "../effect/KillEffect.js";
import { WinConditions } from '../winConditions.js';

export const Amor: Role = {
  type: "amor",
  groups: [RoleGroup.VILLAGER],
  emoji: "💘",
};

export function registerAmorEvents(role = Amor) {
  registerEvent(`reveal.love`, new RevealEvent());

  StartEvents.registerEvent(({ players, settings }) => {
    const cupids = players.filter(hasRole(role));
    const choices = settings.amorCanChooseSelf
      ? players
      : players.filter(others(...cupids));
    return AmorEvent.create(cupids, choices);
  });

  DeathEvents.register((player, _cause, game) => {
    const lovedBy = game.players
      .filter(isAlive)
      .filter((it) => it.roleData.loves === player.id);
    return lovedBy.map(({ id }) => new KillEffect(id, DeathCause.BROKEN_HEART));
  });
}

export function registerLoversWinCondition() {
  WinConditions.register(({ players }) => {
    const alive = players.filter(isAlive);

    if (alive.length !== 2) return false;
    const [romeo, julia] = alive;

    if (romeo.roleData.loves !== julia.id) return false;
    if (julia.roleData.loves !== romeo.id) return false;

    return { type: "lovers", winners: alive };
  });
}
