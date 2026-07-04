import type { LetterScene } from './types';
import { safeAnimate } from './types';

/** B — BALEIA: nada, sobe à superfície, expira pelo espiráculo, faz ondas. */
export const baleiaScene: LetterScene = {
  svg: (e) => `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Baleia no mar">
  <rect width="400" height="320" fill="${e.palette.bg}"/>
  <rect y="170" width="400" height="150" fill="#6FB0C8"/>
  <path id="wave" d="M0 172 q50 -18 100 0 t100 0 t100 0 t100 0 V320 H0 Z" fill="#8AC3D8" opacity="0.7"/>
  <g id="whale" class="tappable" transform="translate(200 210)">
    <path d="M-90 0 q10 -50 90 -50 q80 0 90 40 q-10 30 -90 30 q-70 0 -90 -20 Z" fill="#5E8AA8"/>
    <path d="M78 -6 q34 -22 44 -6 q-14 10 -44 14 Z" fill="#5E8AA8"/>
    <path d="M-90 4 q30 20 90 18 q60 -2 90 -16 q-40 26 -90 26 q-56 0 -90 -28 Z" fill="#CFE6EF"/>
    <circle cx="30" cy="-30" r="5" fill="#3C3A4B"/>
    <path d="M-6 -44 q0 -14 10 -18" id="spout-base" stroke="none"/>
  </g>
  <g id="spout"></g>
</svg>`,
  wire(root, h) {
    const whale = root.querySelector('#whale');
    const spout = root.querySelector('#spout');
    safeAnimate(whale, [{ transform: 'translate(200px,210px)' }, { transform: 'translate(200px,196px)' }, { transform: 'translate(200px,210px)' }],
      { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }, h.reducedMotion());
    whale?.addEventListener('click', () => {
      h.effect('whoosh', 180);
      for (let i = 0; i < 6; i++) {
        const d = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        d.setAttribute('cx', String(204 + (Math.random() * 16 - 8)));
        d.setAttribute('cy', '166');
        d.setAttribute('r', String(4 + Math.random() * 3));
        d.setAttribute('fill', '#EAF6FB');
        spout?.appendChild(d);
        safeAnimate(d, [{ transform: 'translateY(0)', opacity: 0.9 }, { transform: 'translateY(-90px)', opacity: 0 }],
          { duration: 1200, easing: 'ease-out' }, h.reducedMotion())?.addEventListener('finish', () => d.remove());
        if (h.reducedMotion()) setTimeout(() => d.remove(), 300);
      }
    });
  },
};
