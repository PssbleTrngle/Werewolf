import { createApiHandler, methods } from "../../../../lib/server/apiHandlers";
import { Lobby, getLobby } from "../../../../lib/server/games";

const GET = createApiHandler<Lobby>(async (req, res) => {
  // TODO validate
  const { id } = req.query;

  const lobby = await getLobby(id as string);

  res.status(200).json(lobby);
});

export default methods({ GET });
