import { Event } from "models";
import { createApiHandler, methods } from "../../../../lib/apiHandlers";
import { requireSessionView } from "../../../../lib/session";

const GET = createApiHandler<Event<unknown>>(async (req, res) => {
  const view = await requireSessionView(req, res);

  res.status(200).json(view.currentEvent());
});

export default methods({ GET });
