import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { IdParameter } from "@/lib/server/schemas";
import { requireSessionView } from "@/lib/server/session";

const GET = createApiHandler(async (req, res) => {
  const { id } = IdParameter.parse(req.query);

  const view = await requireSessionView({ req, res }, id);

  res.status(200).json(view.players());
});

export default methods({ GET });
