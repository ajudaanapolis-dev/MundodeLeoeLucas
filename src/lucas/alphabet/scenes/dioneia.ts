import type { LetterScene } from './types';
import { safeAnimate } from './types';

/** D — DIONÉIA: armadilha aberta, inseto aproxima, pelos reagem, fecha e reabre. */
export const dioneiaScene: LetterScene = {
  svg: (e) => `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Planta dioneia">
  <rect width="400" height="320" fill="${e.palette.bg}"/>
  <rect y="250" width="400" height="70" fill="#8B6F47"/>
  <path d="M200 250 q-6 -60 0 -90" stroke="#5E8A4E" stroke-width="14" fill="none"/>
  <g id="trap" transform="translate(200 150)">
    <g id="lobeL"><path d="M0 0 q-60 -10 -54 -46 q30 6 54 22 Z" fill="#7CB05A"/>
      <path d="M-54 -46 l6 12 M-42 -40 l6 12 M-30 -32 l6 12" stroke="#3F6B2C" stroke-width="3"/></g>
    <g id="lobeR"><path d="M0 0 q60 -10 54 -46 q-30 6 -54 22 Z" fill="#7CB05A"/>
      <path d="M54 -46 l-6 12 M42 -40 l-6 12 M30 -32 l-6 12" stroke="#3F6B2C" stroke-width="3"/></g>
  </g>
  <g id="bug" transform="translate(120 120)"><ellipse rx="9" ry="6" fill="#3C3A4B"/>
    <circle cx="8" cy="-3" r="3" fill="#3C3A4B"/></g>
</svg>`,
  wire(root, h) {
    const bug = root.querySelector('#bug');
    const lobeL = root.querySelector('#lobeL');
    const lobeR = root.querySelector('#lobeR');
    const trap = root.querySelector('#trap');
    trap?.addEventListener('click', () => {
      h.effect('whoosh', 240);
      safeAnimate(bug, [{ transform: 'translate(120px,120px)' }, { transform: 'translate(196px,150px)' }],
        { duration: 700, easing: 'ease-in', fill: 'forwards' }, h.reducedMotion());
      setTimeout(() => {
        h.effect('pop', 200);
        safeAnimate(lobeL, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(28deg)' }, { transform: 'rotate(0deg)' }],
          { duration: 1800, easing: 'ease-in-out' }, h.reducedMotion());
        safeAnimate(lobeR, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-28deg)' }, { transform: 'rotate(0deg)' }],
          { duration: 1800, easing: 'ease-in-out' }, h.reducedMotion());
      }, h.reducedMotion() ? 0 : 700);
    });
  },
};
