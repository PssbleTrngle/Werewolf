import type { Player } from "models";
import schemaBuilder from "./builder";

export const PlayerType = schemaBuilder.objectRef<Player>("Player");

PlayerType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeID("name"),
  }),
});
