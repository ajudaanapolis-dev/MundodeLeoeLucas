import type { LetterScene } from './types';
import { safeAnimate } from './types';

/** X — XILOFONE: barras tocáveis com sons diferentes (dó ré mi fá sol lá si). */
const NOTES = [
  { name: 'dó', f: 261.63, c: '#F6595E' },
  { name: 'ré', f: 293.66, c: '#F6A23B' },
  { name: 'mi', f: 329.63, c: '#FBE05A' },
  { name: 'fá', f: 349.23, c: '#7CC46E' },
  { name: 'sol', f: 392.0, c: '#5CBEE0' },
  { name: 'lá', f: 440.0, c: '#6C8EE0' },
  { name: 'si', f: 493.88, c: '#B07CE0' },
];

export const xilofoneScene: LetterScene = {
  svg: (e) => {
    const bars = NOTES.map((n, i) => {
      const w = 240 - i * 22;
      const x = 200 - w / 2;
      const y = 60 + i * 30;
      return `<g class="bar tappable" data-i="${i}">
        <rect x="${x}" y="${y}" width="${w}" height="22" rx="8" fill="${n.c}"/>
        <circle cx="${x + 14}" cy="${y + 11}" r="4" fill="#3C3A4B" opacity="0.3"/>
        <circle cx="${x + w - 14}" cy="${y + 11}" r="4" fill="#3C3A4B" opacity="0.3"/>
      </g>`;
    }).join('');
    return `
<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" aria-label="Xilofone">
  <rect width="400" height="320" fill="${e.palette.bg}"/>
  <rect x="70" y="52" width="260" height="240" rx="18" fill="#F0E6D6" opacity="0.5"/>
  ${bars}
</svg>`;
  },
  wire(root, h) {
    root.querySelectorAll('.bar').forEach((bar) => {
      bar.addEventListener('click', () => {
        const i = Number((bar as SVGElement).dataset.i ?? '0');
        const note = NOTES[i];
        h.note(note.f, 480);
        safeAnimate(bar.querySelector('rect'), [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.7)' }, { transform: 'scaleY(1)' }],
          { duration: 260, easing: 'ease-out' }, h.reducedMotion());
      });
    });
  },
};
