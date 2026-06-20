import schemaBuilder from "./builder";

export type SucessfulAction = {
  success: true;
};

export const SucessfulAction = schemaBuilder
  .objectRef<SucessfulAction>("Action")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
    }),
  });
