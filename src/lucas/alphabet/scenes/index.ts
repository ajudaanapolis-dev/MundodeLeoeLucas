import type { LetterScene } from './types';
import { fallbackScene } from './_fallback';
import { axoloteScene } from './axolote';
import { baleiaScene } from './baleia';
import { caracolScene } from './caracol';
import { dioneiaScene } from './dioneia';
import { xilofoneScene } from './xilofone';
import { generatedScene } from './generated';

const REGISTRY: Record<string, LetterScene> = {
  A: axoloteScene,
  B: baleiaScene,
  C: caracolScene,
  D: dioneiaScene,
  X: xilofoneScene,
};

export function sceneFor(letter: string): LetterScene {
  const key=letter.toUpperCase();
  return REGISTRY[key] ?? generatedScene(key) ?? fallbackScene;
}
