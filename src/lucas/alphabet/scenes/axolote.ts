import type { LetterScene } from './types';
import { safeAnimate } from './types';

/** A — AXOLOTE: nada, mexe a cauda, solta bolhas, esconde atrás da planta. */
export const axoloteScene: LetterScene = {
  svg: (e) => `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Axolote no aquário">
  <defs><linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${e.palette.bg}"/><stop offset="1" stop-color="#7FC3D8"/>
  </linearGradient></defs>
  <rect width="400" height="320" fill="url(#water)"/>
  <rect y="278" width="400" height="42" fill="#E6D2A8"/>
  <g id="plant"><path d="M60 300 q-14 -70 8 -110 q10 40 4 110" fill="#7FB77E"/>
    <path d="M78 300 q10 -60 26 -92 q-4 42 -12 92" fill="#8FC18E"/></g>
  <g id="axo" class="tappable" transform="translate(220 170)">
    <g id="tail"><path d="M46 6 q40 -6 58 10 q-40 8 -58 -2 Z" fill="#F7C9D6"/></g>
    <ellipse cx="0" cy="6" rx="52" ry="26" fill="#F8D2DD"/>
    <circle cx="-40" cy="-2" r="20" fill="#F8D2DD"/>
    <g id="gills" stroke="#EE9FB6" stroke-width="6" stroke-linecap="round">
      <path d="M-52 -14 q-16 -8 -24 -2"/><path d="M-54 -4 q-18 -2 -26 4"/>
      <path d="M-52 6 q-16 6 -22 12"/></g>
    <circle cx="-48" cy="-6" r="4" fill="#3C3A4B"/>
    <circle cx="-32" cy="-6" r="4" fill="#3C3A4B"/>
    <path d="M-50 6 q10 6 20 0" stroke="#C77" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <g id="bubbles"></g>
</svg>`,
  wire(root, h) {
    const axo = root.querySelector('#axo');
    const tail = root.querySelector('#tail');
    const bubbles = root.querySelector('#bubbles');
    if (!h.reducedMotion()) {
      safeAnimate(axo, [
        { transform: 'translate(220px,170px)' },
        { transform: 'translate(150px,150px)' },
        { transform: 'translate(220px,170px)' },
      ], { duration: 6000, iterations: Infinity, easing: 'ease-in-out' }, false);
      safeAnimate(tail, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-6deg)' }],
        { duration: 900, iterations: Infinity, easing: 'ease-in-out' }, false);
    }
    axo?.addEventListener('click', () => {
      h.effect('splash', 300);
      for (let i = 0; i < 5; i++) {
        const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        b.setAttribute('cx', String(170 + i * 8));
        b.setAttribute('cy', '160');
        b.setAttribute('r', String(3 + Math.random() * 4));
        b.setAttribute('fill', '#FFFFFF');
        b.setAttribute('opacity', '0.7');
        bubbles?.appendChild(b);
        safeAnimate(b, [{ transform: 'translateY(0)', opacity: 0.7 }, { transform: 'translateY(-140px)', opacity: 0 }],
          { duration: 1400 + i * 120, easing: 'ease-out' }, h.reducedMotion())?.addEventListener('finish', () => b.remove());
        if (h.reducedMotion()) setTimeout(() => b.remove(), 300);
      }
    });
  },
};
