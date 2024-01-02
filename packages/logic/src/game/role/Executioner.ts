import { shuffle } from "lodash-es";
import { DeathCause, Role, RoleGroup } from "models";
import { ChangeRoleEffect } from "../effect/ChangeRoleEffect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { PlayerDataEffect } from "../effect/PlayerDataEffect.js";
import { DeathEvents } from "../event/DeathEvent.js";
import { individualEvents, roleScopedFactory } from "../event/Event.js";
import { registerEvent } from "../event/EventRegistry.js";
import { RevealEvent } from "../event/RevealEvent.js";
import { StartEvents } from "../event/StartEvent.js";
import { Player } from "../player/Player.js";
import {
  hasRole,
  inGroup,
  isAlive,
  others,
  requirePlayer,
} from "../player/predicates.js";
import { WinConditions } from "../winConditions.js";
import { Jester } from "./Jester.js";

export const Executioner: Role = {
  type: "executioner",
  emoji: "🪓",
  groups: [],
  impact: -2,
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

const WINNING_CAUSES = [DeathCause.LYNCHED];

export function registerExecutionEvents(role = Executioner) {
  registerEvent(`reveal.${role.type}`, new RevealEvent());

  StartEvents.register((game) => {
    const users = game.players.filter(hasRole(role));
    const possibleTargets = game.players.filter(isValidTarget);

    if (users.length === 0) {
      return new EventEffect(
        roleScopedFactory(role, () => RevealEvent.create(role.type, [], [])),
      );
    }

    return users.flatMap((user) => {
      const target = shuffle(possibleTargets).find(others(user));

      if (!target) {
        // convert execution to jester or villager?
        throw new Error(`could not find a valid ${role.type} target`);
      }

      return [
        new PlayerDataEffect(user.id, { target: target?.id }),
        new EventEffect(
          roleScopedFactory(role, () =>
            individualEvents([user], (it) =>
              RevealEvent.create(role.type, it, [target]),
            ),
          ),
        ),
      ];
    });
  });

  DeathEvents.register((subject, cause, game) => {
    if (WINNING_CAUSES.includes(cause)) return false;

    const users = game.players.filter(hasRole(role));
    const targeting = users.filter((it) => it.roleData.target === subject.id);

    return targeting.map((it) => new ChangeRoleEffect(it.id, Jester));
  });
}

export function registerExecutionerWinCondition(role = Executioner.type) {
  WinConditions.register((game) => {
    const users = game.players.filter(hasRole(role));

    const withTarget = users
      .filter((it) => it.roleData.target !== undefined)
      .map((user) => {
        const target = requirePlayer(game.players, user.roleData.target!);
        return { user, target };
      });

    const lostTarget = withTarget.filter((it) => !isAlive(it.target));

    const winners = lostTarget
      .filter((it) => WINNING_CAUSES.includes(it.target.deathCause!))
      .map((it) => it.user);

    if (winners.length) {
      return {
        type: role,
        winners,
      };
    }

    return false;
  });
}
