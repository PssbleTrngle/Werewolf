import { omit } from "lodash-es";
import { Player, PlayerRevealType, Role, RoleGroup } from "models";

const evilGroups = [RoleGroup.EVIL, RoleGroup.WOLF];

const alignment = (role: Partial<Role>): Partial<Role> => {
  if (!role.groups) return {};
  if (role.groups?.some((it) => evilGroups.includes(it))) {
    return { groups: [RoleGroup.EVIL] };
  }
  return { groups: [RoleGroup.GOOD] };
};

export default function revealPlayer(
  player: Player,
  type: PlayerRevealType,
): Player {
  switch (type) {
    // TODO strip stuff
    case PlayerRevealType.ROLE:
      return player;
    case PlayerRevealType.GROUP:
      return { ...player, role: player.role && { groups: player.role.groups } };
    case PlayerRevealType.ALIGNMENT:
      return {
        ...player,
        role: player.role && alignment(player.role),
      };
    case PlayerRevealType.NOTHING:
      return omit(player, ["role"]);
  }
}
