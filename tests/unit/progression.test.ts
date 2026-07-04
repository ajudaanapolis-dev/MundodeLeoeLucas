import { describe, it, expect } from 'vitest';
import { computeMastery, recommendLevel, applyOutcome, type Stats } from '@/progress/progression';

const base: Stats = { level: 1, attempts: 0, correct: 0, hints: 0, conclusions: 0, recent: [] };

describe('progressão adaptativa', () => {
  it('mastery fica em [0,1]', () => {
    const m = computeMastery({ ...base, attempts: 10, correct: 10, recent: [1, 1, 1] });
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThanOrEqual(1);
  });

  it('NÃO promove por cliques sem acertos', () => {
    let s: Stats = { ...base };
    for (let i = 0; i < 12; i++) s = applyOutcome(s, { correct: false, usedHint: false });
    expect(s.level).toBe(1); // muitos cliques, nenhum acerto -> continua nível 1
  });

  it('promove com alto acerto recente após tentativas mínimas', () => {
    let s: Stats = { ...base };
    for (let i = 0; i < 6; i++) s = applyOutcome(s, { correct: true, usedHint: false, concluded: true });
    expect(s.level).toBeGreaterThan(1);
  });

  it('dicas reduzem o mastery', () => {
    const semDica = computeMastery({ ...base, attempts: 8, correct: 6, recent: [1, 1, 0, 1] });
    const comDica = computeMastery({ ...base, attempts: 8, correct: 6, hints: 6, recent: [1, 1, 0, 1] });
    expect(comDica).toBeLessThan(semDica);
  });

  it('rebaixa quando o desempenho recente despenca', () => {
    const s: Stats = { level: 3, attempts: 8, correct: 1, hints: 5, conclusions: 0, recent: [0, 0, 0, 0] };
    expect(recommendLevel(s)).toBe(2);
  });

  it('nunca ultrapassa os limites 1..4', () => {
    const top: Stats = { level: 4, attempts: 20, correct: 20, hints: 0, conclusions: 3, recent: [1, 1, 1, 1] };
    expect(recommendLevel(top)).toBe(4);
  });
});
