import { isAdmin } from "@/lib/server/permissions";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ModeratorGameView, PlayerGameView, requirePlayer } from "logic";
import { ApiError, Id } from "models";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";

import { IdSchema } from "@/lib/server/schemas";
import connectStorage from "@/lib/server/storage";
import { ModeratorUser } from "@/lib/specialUsers";
import { GameStatus } from "storage/src/lobbies";
import zod from "zod";

async function gameIdOf(session: Session) {
  const storage = await connectStorage();
  const lobby = await storage.lobbies.lobbyOf(session.user.id);
  if (!lobby || lobby.status === GameStatus.NONE) return null;
  return lobby.id;
}

const ViewQuerySchema = zod.object({
  impersonated: IdSchema.optional(),
});

export type ViewQuery = zod.infer<typeof ViewQuerySchema>;

export async function wrapSessionView(
  session: Session,
  gameId?: Id,
  query: ViewQuery = {},
) {
  const storage = await connectStorage();

  const realGameId = gameId ?? (await gameIdOf(session));
  if (!realGameId) return null;

  const game = await storage.games.getGame(realGameId);
  const admin = isAdmin(session.user);

  if (isAdmin(session.user) && query.impersonated) {
    if (query.impersonated === ModeratorUser.id) {
      return new ModeratorGameView(game);
    } else {
      game.requirePlayer(query.impersonated);
      return new PlayerGameView(game, query.impersonated);
    }
  }

  if (!requirePlayer(game.players, session.user.id) && !admin) {
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

function extractQuery(ctx: SessionContext) {
  if ("req" in ctx) {
    const query = (ctx.req as NextApiRequest).query ?? {};
    return ViewQuerySchema.parse(query);
  } else {
    return {};
  }
}

export async function sessionView(ctx: SessionContext, gameId?: Id) {
  const session = await serverSession(ctx);
  if (!session) return null;

  const query = extractQuery(ctx);

  return wrapSessionView(session, gameId, query);
}

export async function requireSessionView(ctx: SessionContext, gameId?: Id) {
  const view = await sessionView(ctx, gameId);
  if (view) return view;
  throw new ApiError(403, "not part of a game");
}
