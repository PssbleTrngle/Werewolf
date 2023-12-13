import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { requireServerSession } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";
import { Lobby } from "storage";

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  const storage = await connectStorage();

  await storage.lobbies.createLobby(session.user);

  res.status(204).send(null);
});

const GET = createApiHandler<ReadonlyArray<Lobby>>(async (req, res) => {
  const storage = await connectStorage();
  const lobbies = await storage.lobbies.getLobbies();

  res.status(200).json(lobbies);
});

export default methods({ GET, POST });
