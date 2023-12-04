import { EventType } from "./Event.js";
import { registerEventFactory } from "./EventRegistry.js";

export abstract class NoDataEvent extends EventType<never> {
  protected static createFactory(key: string, type: EventType<undefined>) {
    return registerEventFactory(key, type, () => ({
      data: null as never,
    }));
  }

  protected viewData() {
    return null as never;
  }
}
