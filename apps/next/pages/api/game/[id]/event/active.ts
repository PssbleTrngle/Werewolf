import { Event } from "models";
import {
  createApiHandler,
  methods,
} from "../../../../../lib/server/apiHandlers";
import { requireSessionView } from "../../../../../lib/server/session";

const GET = createApiHandler<Event>(async (req, res) => {
  // TODO validate & use
  const { id } = req.query;

  const view = await requireSessionView({ req, res });

  res.status(200).json(view.currentEvent());
});

export default methods({ GET });