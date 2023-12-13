import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { IdParameter } from "@/lib/server/schemas";
import connectStorage from "@/lib/server/storage";
import { Lobby } from "storage";

const GET = createApiHandler<Lobby>(async (req, res) => {
  const { id } = IdParameter.parse(req.query);

  const storage = await connectStorage();

  const lobby = await storage.lobbies.getLobby(id);

  res.status(200).json(lobby);
});

export default methods({ GET });
