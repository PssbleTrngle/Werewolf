import { statusOf } from "storage";
import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { requireServerSession } from "@/lib/server/session";

const GET = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });

  const status = await statusOf(session.user.id);

  res.status(200).json(status);
});

export default methods({ GET });
