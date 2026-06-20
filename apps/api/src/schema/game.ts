import type { GameInfo } from "../../../../packages/models/src";
import { requireSessionView } from "../auth";
import storage from "../storage";
import schemaBuilder from "./builder";

const GameType = schemaBuilder.objectRef<GameInfo>("Game").implement({
  fields: (t) => ({
    day: t.exposeInt("day"),
    time: t.exposeString("time"),
  }),
});

schemaBuilder.queryField("game", (t) =>
  t.field({
    args: {
      id: t.arg({
        type: "ID",
        description: "ID of the game",
        required: true,
      }),
    },
    type: GameType,
    resolve: async (_, args, context) => {
      const view = await requireSessionView(context, args.id);
      return view.gameInfo();
    },
  }),
);

type StartedGame = {
  gameId: string;
};

const StartedGameResult = schemaBuilder
  .objectRef<StartedGame>("StartedGameResult")
  .implement({
    fields: (t) => ({
      gameId: t.exposeID("gameId"),
    }),
  });

schemaBuilder.mutationField("startGame", (t) =>
  t.field({
    args: {
      lobby: t.arg({
        type: "ID",
        description: "ID of the lobby",
        required: true,
      }),
    },
    type: StartedGameResult,
    resolve: async (_, args) => {
      const lobby = await storage.lobbies.getLobby(args.lobby);
      const gameId = await storage.games.startGame(lobby);
      return { gameId };
    },
  }),
);
