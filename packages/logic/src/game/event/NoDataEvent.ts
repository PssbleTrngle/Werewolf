import { EventType } from "./Event.js";
import { registerEventFactory } from "./EventRegistry.js";

export abstract class NoDataEvent extends EventType<undefined> {
  protected static createFactory(key: string, type: EventType<undefined>) {
    return registerEventFactory(key, type, () => ({
      data: undefined,
    }));
  }

  protected viewData() {
    return undefined;
  }
}
