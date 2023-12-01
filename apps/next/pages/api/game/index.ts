import { EMPTY_ROLE_DATA, Player, Villager } from "logic";
import { createApiHandler, methods } from "../../../lib/server/apiHandlers";
import { createGame } from "../../../lib/server/games";
import { serverSession } from "../../../lib/server/session";

const POST = createApiHandler(async (req, res) => {
  const session = await serverSession({ req, res });

  const player: Player = {
    // TODO custom session user type
    id: session!.user!.email!,
    name: session!.user!.name!,
    role: Villager,
    roleData: EMPTY_ROLE_DATA,
    status: "alive",
  };

  await createGame(player);
  console.log(`Created Game`);

  res.status(204).send(null);
});

export default methods({ POST });
