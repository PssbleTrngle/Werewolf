import type { Logger } from "../../src/logging";

export default function createTestLogger(): Logger {
  const log: Logger["info"] = () => {};
  return {
    debug: log,
    info: log,
    warn: log,
    error: log,
  };
}
