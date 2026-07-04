import type { LetterScene } from './types';
import { safeAnimate } from './types';

/** C — CARACOL: percorre caminho, deixa rastro, esconde-se na concha. */
export const caracolScene: LetterScene = {
  svg: (e) => `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Caracol na folha">
  <rect width="400" height="320" fill="${e.palette.bg}"/>
  <path d="M0 250 q200 -40 400 0 V320 H0 Z" fill="#8FC18E"/>
  <path id="trail" d="M40 240" stroke="#CDEBC9" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>
  <g id="snail" class="tappable" transform="translate(60 226)">
    <path d="M0 0 q-6 24 18 24 h24 q10 0 10 -8" fill="#F1C7A6"/>
    <g id="body"><path d="M6 -2 q10 -18 30 -14" stroke="#F1C7A6" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="40" cy="-16" r="3" fill="#3C3A4B"/>
      <line x1="34" y1="-20" x2="30" y2="-30" stroke="#F1C7A6" stroke-width="3"/></g>
    <g id="shell"><circle cx="-4" cy="-6" r="22" fill="#E7A977"/>
      <path d="M-4 -6 m0 0 a12 12 0 1 1 -0.1 0 a7 7 0 1 0 0.1 0" fill="none" stroke="#B5794E" stroke-width="4"/></g>
  </g>
</svg>`,
  wire(root, h) {
    const snail = root.querySelector('#snail');
    const body = root.querySelector('#body');
    const trail = root.querySelector('#trail') as SVGPathElement | null;
    let x = 60;
    const move = () => {
      if (h.reducedMotion()) return;
      x = Math.min(320, x + 40);
      trail?.setAttribute('d', `M40 240 L${x} 250`);
      safeAnimate(snail, [{ transform: `translate(${x - 40}px,226px)` }, { transform: `translate(${x}px,226px)` }],
        { duration: 1600, easing: 'ease-in-out', fill: 'forwards' }, false);
    };
    const timer = setInterval(move, 1800);
    root.addEventListener('DOMNodeRemoved', () => clearInterval(timer));
    snail?.addEventListener('click', () => {
      h.effect('pop', 360);
      safeAnimate(body, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 1400, easing: 'ease-in-out' }, h.reducedMotion());
    });
  },
};
