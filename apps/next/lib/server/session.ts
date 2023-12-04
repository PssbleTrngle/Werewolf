import { PlayerGameView } from "logic";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { statusOf } from "./games";

export async function wrapSessionView(session: Session) {
  const playerId = session.user!.email!;

  const status = await statusOf(playerId);

  if (status?.type !== "game") return null;

  return new PlayerGameView(status.game, playerId);
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
