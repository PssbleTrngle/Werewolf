import { Storage } from "storage";

declare global {
  var cachedStorage:
    | {
        promise?: Promise<Storage>;
        resolved?: Storage;
      }
    | undefined;
}
