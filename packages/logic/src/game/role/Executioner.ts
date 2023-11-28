import { shuffle } from "lodash-es";
import { DeathCause, Role, RoleGroup } from "models";
import { EventEffect } from "../effect/EventEffect.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { Player } from "../player/Player.js";
import { hasRole, inGroup, others } from "../player/predicates.js";
import { WinConditions } from "../winConditions.js";
import { Jester } from "./Jester.js";

export const Executioner: Role = {
  type: "executioner",
  emoji: "🪓",
  groups: [],
};

function isValidTarget(player: Player) {
  const illegalGroups = [RoleGroup.WOLF];
  const illegalRoles = [Jester.type];
  const illegalPredicates = [
    ...illegalGroups.map(inGroup),
    ...illegalRoles.map(hasRole),
  ];

  return !illegalPredicates.some((test) => test(player));
}

export function registerExecutionEvents(role = Executioner.type) {
  registerEvent(`reveal.${role}`, new RevealEvent());

  StartEvents.register((game) => {
    const users = game.players.filter(hasRole(role));
    const possibleTargets = game.players.filter(isValidTarget);
    return users.flatMap((user) => {
      const target = shuffle(possibleTargets).find(others(user));

      if (!target) {
        // convert execution to jester or villager?
        throw new Error(`could not find a valid ${role} target`);
      }

      return [
        new PlayerDataEffect(user.id, { target: target?.id }),
        new EventEffect(() => RevealEvent.create(role, [user], [target])),
      ];
    });
  });
}

export function registerExecutionerWinCondition(role = Executioner.type) {
  WinConditions.register((game) => {
    const users = game.players.filter(hasRole(role));

    const winners = users
      .filter((it) => it.roleData.target !== undefined)
      .filter((it) => {
        const target = game.playerById(it.roleData.target!);
        return target.deathCause === DeathCause.LYNCHED;
      });

    if (winners.length) {
      return {
        type: role,
        winners,
      };
    }

    return false;
  });
}
