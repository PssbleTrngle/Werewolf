import { Storage } from "../../src/index.js";

export async function createTestStorage() {
  const storage = await Storage.create();
  await storage.flush();
  return storage;
}
