import { createApiHandler, methods } from "../../../../lib/server/apiHandlers";
import { Lobby, getLobby } from "../../../../lib/server/games";
import { IdParameter } from "../../../../lib/server/schemas";

const GET = createApiHandler<Lobby>(async (req, res) => {
  const { id } = IdParameter.parse(req.query);

  const lobby = await getLobby(id);

  res.status(200).json(lobby);
});

export default methods({ GET });
