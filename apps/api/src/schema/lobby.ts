import { ApiError } from "models";
import type { Lobby } from "storage";
import storage from "../storage";
import schemaBuilder from "./builder";

const LobbyType = schemaBuilder.objectRef<Lobby>("Lobby").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
  }),
});

schemaBuilder.queryField("lobby", (t) =>
  t.field({
    type: LobbyType,
    args: {
      id: t.arg({
        type: "ID",
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await storage.lobbies.getLobby(args.id);
    },
  }),
);

schemaBuilder.mutationField("createLobby", (t) =>
  t.field({
    type: LobbyType,
    resolve: async (_parent, _args, context) => {
      const id = await storage.lobbies.createLobby(context.user);
      return { id } as Lobby;
    },
  }),
);

schemaBuilder.mutationField("leaveLobby", (t) =>
  t.field({
    type: LobbyType,
    resolve: async (_parent, _args, context) => {
      const lobby = await storage.lobbies.lobbyOf(context.user.id);

      if (!lobby) throw new ApiError(403, "you are not part of a lobby");

      await storage.lobbies.leaveLobby(context.user, lobby.id);
      // TODO return something here
      return null;
    },
  }),
);
