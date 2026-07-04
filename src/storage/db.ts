/**
 * Camada IndexedDB com schema versionado e migrações.
 * Stores:
 *  - lucasLetters: registro por letra (visitas, ultimaVisita)
 *  - leoLabs:      registro por laboratório (nível, acertos, erros, tentativas...)
 *  - events:       log append-only de interações (para painel dos responsáveis)
 */
export const DB_NAME = 'mundo-leo-lucas';
export const DB_VERSION = 1;

export interface LucasLetterRecord {
  letter: string;
  visits: number;
  interactions: number;
  lastVisit: number;
  favorite: boolean;
}

export interface LeoLabRecord {
  labId: string;
  level: number;      // 1..4
  correct: number;
  wrong: number;
  attempts: number;
  hints: number;
  experiments: number;
  conclusions: number;
  masteryScore: number; // 0..1
  lastPlayed: number;
}

export interface InteractionEvent {
  id?: number;
  area: 'lucas' | 'leo';
  kind: string;
  ref: string;        // letra ou labId
  ts: number;
  meta?: Record<string, unknown>;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      const from = (e.oldVersion ?? 0);
      migrate(db, from);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function migrate(db: IDBDatabase, fromVersion: number) {
  // v0 -> v1
  if (fromVersion < 1) {
    if (!db.objectStoreNames.contains('lucasLetters')) {
      db.createObjectStore('lucasLetters', { keyPath: 'letter' });
    }
    if (!db.objectStoreNames.contains('leoLabs')) {
      db.createObjectStore('leoLabs', { keyPath: 'labId' });
    }
    if (!db.objectStoreNames.contains('events')) {
      db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
    }
  }
  // Migrações futuras: if (fromVersion < 2) { ... }
}

async function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
  });
}

export const db = {
  getLetter: (letter: string) =>
    tx<LucasLetterRecord | undefined>('lucasLetters', 'readonly', (s) => s.get(letter)),
  putLetter: (rec: LucasLetterRecord) =>
    tx('lucasLetters', 'readwrite', (s) => s.put(rec)),
  allLetters: () =>
    tx<LucasLetterRecord[]>('lucasLetters', 'readonly', (s) => s.getAll()),

  getLab: (labId: string) =>
    tx<LeoLabRecord | undefined>('leoLabs', 'readonly', (s) => s.get(labId)),
  putLab: (rec: LeoLabRecord) =>
    tx('leoLabs', 'readwrite', (s) => s.put(rec)),
  allLabs: () =>
    tx<LeoLabRecord[]>('leoLabs', 'readonly', (s) => s.getAll()),

  addEvent: (e: InteractionEvent) =>
    tx('events', 'readwrite', (s) => s.add(e)),
  putEvent: (e: InteractionEvent) =>
    tx('events', 'readwrite', (s) => s.put(e)),
  allEvents: () =>
    tx<InteractionEvent[]>('events', 'readonly', (s) => s.getAll()),

  async clearAll(): Promise<void> {
    const database = await open();
    await Promise.all(
      ['lucasLetters', 'leoLabs', 'events'].map(
        (name) =>
          new Promise<void>((res, rej) => {
            const t = database.transaction(name, 'readwrite');
            const r = t.objectStore(name).clear();
            r.onsuccess = () => res();
            r.onerror = () => rej(r.error);
          }),
      ),
    );
    database.close();
  },
};
