import { initContextCache } from "@pothos/core";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { createAuthContext } from "./auth";
import config from "./config";
import logger from "./logger";
import { schema } from "./schema";

const yoga = createYoga({
  schema,
  context: async ({ request }) => ({
    ...initContextCache(),
    ...(await createAuthContext(request)),
  }),
});

const server = createServer(yoga);

server.listen(config.port, () => {
  logger.info(`Server is running on http://localhost:${config.port}/graphql`);
});
