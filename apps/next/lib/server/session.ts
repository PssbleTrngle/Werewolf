import { PlayerGameView, requirePlayer } from "logic";
import { ApiError, Id } from "models";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";
import { getGame, statusOf } from "storage";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { isAdmin } from "./permissions";

async function gameIdOf(session: Session) {
  const status = await statusOf(session.user.id);
  if (status?.type !== "game") return null;
  return status.id;
}

export async function wrapSessionView(session: Session, gameId?: Id) {
  const realGameId = gameId ?? (await gameIdOf(session));
  if (!realGameId) return null;

  const game = await getGame(realGameId);

  if (!requirePlayer(game.players, session.user.id) && !isAdmin(session.user)) {
    throw new ApiError(302, "You are not part of this game");
  }

  return new PlayerGameView(game, session.user.id);
}

type SessionContext =
  | Session
  | Readonly<{
      req: NextApiRequest | GetServerSidePropsContext["req"];
      res: NextApiResponse | GetServerSidePropsContext["res"];
    }>;

export async function serverSession(ctx: SessionContext) {
  if ("req" in ctx && "res" in ctx) {
    return getServerSession(ctx.req, ctx.res, authOptions);
  } else {
    return ctx;
  }
}

export async function requireServerSession(ctx: SessionContext) {
  const session = await serverSession(ctx);
  if (session) return session;
  throw new ApiError(401, "login required");
}

export async function sessionView(ctx: SessionContext, gameId?: Id) {
  const session = await serverSession(ctx);
  if (!session) return null;
  return wrapSessionView(session, gameId);
}

export async function requireSessionView(ctx: SessionContext, gameId?: Id) {
  const view = await sessionView(ctx, gameId);
  if (view) return view;
  throw new ApiError(403, "not part of a game");
}
