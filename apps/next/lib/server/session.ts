import { PlayerGameView } from "logic";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getGame, statusOf } from "./games";

export async function wrapSessionView(session: Session) {
  const status = await statusOf(session.user.id);

  if (status?.type !== "game") return null;
  const game = await getGame(status.id);

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
