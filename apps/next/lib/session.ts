import { EMPTY_ROLE_DATA, Game, Player, PlayerGameView, Villager } from "logic";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export function serverSession(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, authOptions);
}

export async function sessionView(req: NextApiRequest, res: NextApiResponse) {
  const session = await serverSession(req, res);

  const player: Player = {
    id: session.user.email,
    name: session.user.name,
    role: Villager,
    roleData: EMPTY_ROLE_DATA,
    status: "alive",
  };

  const game = Game.create([player]);

  return new PlayerGameView(game, player.id);
}
