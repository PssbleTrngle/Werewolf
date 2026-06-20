import type { User } from "models";
import schemaBuilder from "./builder";

const UserType = schemaBuilder.objectRef<User>("User").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});

schemaBuilder.queryField("currentUser", (t) =>
  t.field({
    type: UserType,
    resolve: (_parent, _args, context) => context.user,
  }),
);
