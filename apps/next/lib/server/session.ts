import { PlayerGameView } from "logic";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { gameOf } from "./games";

export async function wrapSessionView(session: Session) {
  const playerId = session.user!.email!;

  const game = await gameOf(playerId);

  if (!game) return null;

  return new PlayerGameView(game, playerId);
}

type SessionContext =
  | Session
  | Readonly<{ req: NextApiRequest; res: NextApiResponse }>;

export async function serverSession(ctx: SessionContext) {
  if ("req" in ctx && "res" in ctx) {
    return getServerSession(ctx.req, ctx.res, authOptions);
  } else {
    return ctx;
  }
}

export async function sessionView(ctx: SessionContext) {
  const session = await serverSession(ctx);
  if (!session) return null;
  return wrapSessionView(session);
}

export async function requireSessionView(ctx: SessionContext) {
  const view = await sessionView(ctx);
  if (view) return view;
  throw new ApiError(403, "not part of a game");
}
