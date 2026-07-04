import type { ScreenFactory } from '@/app/Router';
import { el } from '@/core/dom';
import { topBar } from '@/components/topbar';
import { LETTERS } from './data';
import { audio } from '@/audio/AudioEngine';

/** Painel com as 26 letras — botões grandes, um toque abre a cena. */
export const AlphabetScreen: ScreenFactory = (host) => {
  const grid = el('div', { class: 'alpha-grid', role: 'list', 'aria-label': 'Alfabeto' });
  for (const entry of LETTERS) {
    const btn = el('button', {
      class: 'alpha-btn', role: 'listitem',
      'aria-label': `${entry.letter} de ${entry.word}`,
      style: `background:${entry.palette.bg};`,
      onclick: () => {
        audio.effect('pop', 480);
        window.location.hash = `/lucas/${entry.letter}`;
      },
    }, [entry.letter]);
    grid.appendChild(btn);
  }
  const screen = el('div', { class: 'screen' }, [
    topBar('Mundo do Lucas', '/'),
    el('p', { style: 'text-align:center;' }, ['Toque em uma letra para brincar!']),
    grid,
  ]);
  host.appendChild(screen);
};
