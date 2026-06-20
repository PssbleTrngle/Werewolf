import SchemaBuilder from "@pothos/core";
import type { User } from "models";

const schemaBuilder = new SchemaBuilder<{
  Context: {
    user: User;
  };
}>({});

export default schemaBuilder;
