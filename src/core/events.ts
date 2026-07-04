type Handler<T> = (payload: T) => void;

/** Barramento de eventos minimalista e tipado. */
export class EventBus<Events extends Record<string, unknown>> {
  private handlers = new Map<keyof Events, Set<Handler<never>>>();

  on<K extends keyof Events>(type: K, h: Handler<Events[K]>): () => void {
    let set = this.handlers.get(type);
    if (!set) { set = new Set(); this.handlers.set(type, set); }
    set.add(h as Handler<never>);
    return () => set!.delete(h as Handler<never>);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    this.handlers.get(type)?.forEach((h) => (h as Handler<Events[K]>)(payload));
  }
}
