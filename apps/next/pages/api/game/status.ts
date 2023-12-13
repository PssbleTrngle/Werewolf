import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { requireServerSession } from "@/lib/server/session";
import connectStorage from "@/lib/server/storage";

const GET = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });

  const storage = await connectStorage();

  const status = await storage.statusOf(session.user.id);

  res.status(200).json(status);
});

export default methods({ GET });
