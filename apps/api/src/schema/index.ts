import schemaBuilder from "./builder";
import "./game";
import "./lobby";
import "./player";
import "./user";
import "./votes";

schemaBuilder.queryType({});
schemaBuilder.mutationType({});

export const schema = schemaBuilder.toSchema();
