import { db, DB_VERSION } from './db';

export interface SaveBundle {
  schema: number;
  exportedAt: string;
  lucasLetters: unknown[];
  leoLabs: unknown[];
  events: unknown[];
}

/** Serializa todo o progresso para JSON (download no painel dos responsáveis). */
export async function exportProgress(): Promise<SaveBundle> {
  const [lucasLetters, leoLabs, events] = await Promise.all([
    db.allLetters(),
    db.allLabs(),
    db.allEvents(),
  ]);
  return {
    schema: DB_VERSION,
    exportedAt: new Date().toISOString(),
    lucasLetters,
    leoLabs,
    events,
  };
}

export function validateBundle(data: unknown): data is SaveBundle {
  if (typeof data !== 'object' || data === null) return false;
  const b = data as Record<string, unknown>;
  const lettersOk = Array.isArray(b.lucasLetters) && b.lucasLetters.every((x) => {
    if (typeof x !== 'object' || x === null) return false; const r=x as Record<string,unknown>;
    return typeof r.letter==='string' && /^[A-Z]$/.test(r.letter) && typeof r.visits==='number' && r.visits>=0 && typeof r.interactions==='number' && r.interactions>=0;
  });
  const labsOk = Array.isArray(b.leoLabs) && b.leoLabs.every((x) => {
    if (typeof x !== 'object' || x === null) return false; const r=x as Record<string,unknown>;
    return typeof r.labId==='string' && typeof r.level==='number' && r.level>=1 && r.level<=4 && typeof r.attempts==='number' && r.attempts>=0;
  });
  const eventsOk = Array.isArray(b.events) && b.events.every((x) => {
    if (typeof x !== 'object' || x === null) return false; const r=x as Record<string,unknown>;
    return (r.area==='lucas'||r.area==='leo') && typeof r.kind==='string' && typeof r.ref==='string' && typeof r.ts==='number';
  });
  return typeof b.schema==='number' && lettersOk && labsOk && eventsOk;
}

/** Importa e mescla um bundle validado. Estado corrompido é rejeitado. */
export async function importProgress(raw: string): Promise<{ ok: true } | { ok: false; error: string }> {
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return { ok: false, error: 'JSON inválido' }; }
  if (!validateBundle(data)) return { ok: false, error: 'Estrutura de backup não reconhecida' };
  if (data.schema > DB_VERSION) return { ok: false, error: 'Backup de versão mais nova que o app' };

  try {
    for (const rec of data.lucasLetters as never[]) await db.putLetter(rec);
    for (const rec of data.leoLabs as never[]) await db.putLab(rec);
    for (const rec of data.events as never[]) await db.putEvent(rec);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `Falha ao gravar: ${(e as Error).message}` };
  }
}
