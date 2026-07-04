import type { LetterEntry } from '@/core/types';

export interface SceneHelpers {
  effect: (kind: 'pop' | 'splash' | 'chime' | 'whoosh' | 'success', freq?: number) => void;
  note: (freq: number, ms?: number) => void;
  reducedMotion: () => boolean;
}

export interface LetterScene {
  /** SVG do palco (composição própria da letra). */
  svg(entry: LetterEntry): string;
  /** Liga interações: toque no objeto -> animação + som. */
  wire(root: SVGElement, h: SceneHelpers): void;
}

/** Animação segura: respeita redução de movimento. */
export function safeAnimate(
  el: Element | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  reduced: boolean,
): Animation | null {
  if (!el) return null;
  if (reduced) return null;
  try {
    return (el as unknown as { animate: Element['animate'] }).animate(keyframes, options);
  } catch {
    return null;
  }
}
