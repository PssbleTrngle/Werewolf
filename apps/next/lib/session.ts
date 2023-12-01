import { PlayerGameView } from "logic";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { gameOf } from "./games";

export function serverSession(req: NextApiRequest, res: NextApiResponse) {
  return getServerSession(req, res, authOptions);
}

export async function sessionView(req: NextApiRequest, res: NextApiResponse) {
  const session = await serverSession(req, res);

  const playerId = session!.user!.email!;

  const game = await gameOf(playerId);

  if (!game) return null;

  return new PlayerGameView(game, playerId);
}

export async function requireSessionView(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const view = await sessionView(req, res);
  if (view) return view;
  throw new ApiError(403, "not part of a game");
}
