import { omit } from "lodash-es";
import { Player, PlayerRevealType } from "models";

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
    // TODO implement
    case PlayerRevealType.ALIGNMENT:
    case PlayerRevealType.NOTHING:
      return omit(player, ["role"]);
  }
}
