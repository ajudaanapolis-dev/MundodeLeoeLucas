import { describe, it, expect } from 'vitest';
import { LETTERS, getLetter } from '@/lucas/alphabet/data';
import { sceneFor } from '@/lucas/alphabet/scenes';

describe('alfabeto do Lucas', () => {
  it('tem exatamente 26 letras A..Z', () => {
    expect(LETTERS).toHaveLength(26);
    const seq = LETTERS.map((l) => l.letter).join('');
    expect(seq).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  });

  it('toda letra tem palavra, artigo, fato e paleta', () => {
    for (const l of LETTERS) {
      expect(l.word.length).toBeGreaterThan(1);
      expect(['O', 'A']).toContain(l.article);
      expect(l.fact.length).toBeGreaterThan(10);
      expect(l.palette.bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('toda letra produz um SVG de cena válido', () => {
    for (const l of LETTERS) {
      const scene = sceneFor(l.letter);
      const markup = scene.svg(l);
      expect(markup).toContain('<svg');
      expect(markup).toContain('</svg>');
    }
  });

  it('getLetter é case-insensitive', () => {
    expect(getLetter('a')?.word).toBe('Axolote');
  });
});
