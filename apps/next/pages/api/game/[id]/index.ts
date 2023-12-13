import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { isAdmin } from "@/lib/server/permissions";
import { IdParameter } from "@/lib/server/schemas";
import { requireServerSession, requireSessionView } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";
import { ApiError, GameInfo } from "models";

const GET = createApiHandler<GameInfo>(async (req, res) => {
  const { id } = IdParameter.parse(req.query);

  const view = await requireSessionView({ req, res }, id);

  res.status(200).json(view.gameInfo());
});

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  const { id } = IdParameter.parse(req.query);

  const storage = await connectStorage();

  const lobby = await storage.lobbies.getLobby(id);

  if (lobby.owner.id !== session.user.id && !isAdmin(session.user)) {
    throw new ApiError(403, "you are not the owner of this lobby");
  }

  const game = await storage.games.startGame(lobby);

  res.status(200).json({ gameId: id });
});

export default methods({ GET, POST });
