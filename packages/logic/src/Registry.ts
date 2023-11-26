export interface FrozenRegistry<T> {
  getOptional(key: string): T | undefined;
  get(key: string): T;
}

export default class Registry<T> implements FrozenRegistry<T> {
  constructor(public readonly type: string) {}

  private values = new Map<string, T>();

  register(key: string, value: T) {
    if (this.values.has(key)) {
      console.log(`Overwriting ${this.type} '${key}'`);
    }

    this.values.set(key, value);
  }

  getOptional(key: string) {
    return this.values.get(key);
  }

  get(key: string) {
    const value = this.getOptional(key);
    if (value) return value;
    else throw new Error(`Unknown ${this.type}: '${key}'`);
  }

  freeze(): FrozenRegistry<T> {
    return this;
  }
}
