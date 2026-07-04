import { describe, it, expect } from 'vitest';
import { db } from '@/storage/db';
import { exportProgress, importProgress, validateBundle } from '@/storage/exportImport';

describe('persistência e backup', () => {
  it('exporta e reimporta progresso', async () => {
    await db.putLetter({ letter: 'A', visits: 3, interactions: 5, lastVisit: 1, favorite: true });
    await db.putLab({ labId: 'aquario', level: 2, correct: 4, wrong: 1, attempts: 5, hints: 0, experiments: 5, conclusions: 4, masteryScore: 0.8, lastPlayed: 1 });

    const bundle = await exportProgress();
    expect(validateBundle(bundle)).toBe(true);
    expect(bundle.lucasLetters.length).toBeGreaterThan(0);

    await db.clearAll();
    expect((await db.allLetters()).length).toBe(0);

    const res = await importProgress(JSON.stringify(bundle));
    expect(res.ok).toBe(true);
    expect((await db.allLetters()).length).toBe(1);
  });

  it('rejeita JSON corrompido', async () => {
    const res = await importProgress('{ isso não é válido');
    expect(res.ok).toBe(false);
  });

  it('rejeita estrutura desconhecida', async () => {
    const res = await importProgress(JSON.stringify({ foo: 1 }));
    expect(res.ok).toBe(false);
  });
});
