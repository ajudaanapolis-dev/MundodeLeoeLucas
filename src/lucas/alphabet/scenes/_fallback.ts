import type { LetterEntry } from '@/core/types';
import type { LetterScene } from './types';
import { safeAnimate } from './types';

/**
 * TEMPLATE COMPARTILHADO (scaffold honesto).
 * Cena interativa funcional usada por letras que ainda não têm arte dedicada.
 * Criatura pastel original que reage ao toque. Cada letra recebe cor e inicial
 * próprias; NÃO é arte final e está marcada como pendente (hasBespokeScene:false).
 */
export const fallbackScene: LetterScene = {
  svg(entry: LetterEntry): string {
    const { accent } = entry.palette;
    return `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Cena de ${entry.word}">
  <g id="obj" class="tappable" transform="translate(200 180)">
    <ellipse cx="0" cy="70" rx="70" ry="12" fill="#3C3A4B" opacity="0.12"/>
    <path d="M-70 20 q0 -90 70 -90 q70 0 70 90 q0 40 -70 40 q-70 0 -70 -40 Z" fill="${accent}"/>
    <circle cx="-24" cy="-4" r="10" fill="#3C3A4B"/>
    <circle cx="24" cy="-4" r="10" fill="#3C3A4B"/>
    <circle cx="-21" cy="-7" r="3" fill="#fff"/>
    <circle cx="27" cy="-7" r="3" fill="#fff"/>
    <path d="M-18 26 q18 16 36 0" stroke="#B5654A" stroke-width="5" fill="none" stroke-linecap="round"/>
    <text x="0" y="6" font-family="Baloo 2, sans-serif" font-size="40" font-weight="700"
          fill="#FFFFFF" text-anchor="middle" opacity="0.85">${entry.letter}</text>
  </g>
</svg>`;
  },
  wire(root, h) {
    const obj = root.querySelector('#obj');
    obj?.addEventListener('click', () => {
      h.effect('pop', 520);
      safeAnimate(
        obj,
        [
          { transform: 'translate(200px,180px) scale(1)' },
          { transform: 'translate(200px,150px) scale(1.08)' },
          { transform: 'translate(200px,180px) scale(1)' },
        ],
        { duration: 520, easing: 'cubic-bezier(0.34,1.56,0.64,1)' },
        h.reducedMotion(),
      );
    });
  },
};
