import type { ScreenFactory } from '@/app/Router';
import { el, svg } from '@/core/dom';
import { topBar } from '@/components/topbar';
import { getLetter, LETTERS } from './data';
import { sceneFor } from './scenes';
import { audio } from '@/audio/AudioEngine';
import { settings } from '@/accessibility/settings';
import { db } from '@/storage/db';

/**
 * Cena da letra: letra grande, palavra, objeto animado, narração e controles
 * (repetir / próxima). Cada objeto tem interação própria (registro em scenes/).
 */
export const SceneScreen: ScreenFactory = (host, params) => {
  const entry = getLetter(params.letter);
  if (!entry) { window.location.hash = '/lucas'; return; }

  const scene = sceneFor(entry.letter);
  const stage = el('div', { class: 'scene__stage', style: `background:${entry.palette.bg};` });
  const stageSvg = svg(scene.svg(entry));
  stage.appendChild(stageSvg);
  stage.appendChild(el('span', { class: 'scene__letter' }, [entry.letter]));

  scene.wire(stageSvg as SVGElement, {
    effect: (k, f) => audio.effect(k, f),
    note: (f, ms) => audio.note(f, ms),
    reducedMotion: () => settings.get().reducedMotion,
  });

  stageSvg.addEventListener('click', () => {
    void (async () => {
      try {
        const rec = (await db.getLetter(entry.letter)) ?? { letter: entry.letter, visits: 0, interactions: 0, lastVisit: 0, favorite: false };
        rec.interactions += 1; rec.lastVisit = Date.now();
        await db.putLetter(rec);
        await db.addEvent({ area: 'lucas', kind: 'interaction', ref: entry.letter, ts: Date.now() });
      } catch { /* persistência opcional */ }
    })();
  });

  const narrate = async () => {
    await audio.say('letters', entry.letter);
    await audio.say('words', entry.letter);
    await audio.say('facts', entry.letter);
  };

  const idx = LETTERS.findIndex((l) => l.letter === entry.letter);
  const nextLetter = LETTERS[(idx + 1) % LETTERS.length].letter;

  const controls = el('div', { class: 'scene__controls' }, [
    el('button', { class: 'btn btn--peach', 'aria-label': 'Repetir narração', onclick: narrate }, ['🔁 Repetir']),
    el('button', {
      class: 'btn btn--accent', 'aria-label': 'Próxima letra',
      onclick: () => { audio.effect('whoosh', 360); window.location.hash = `/lucas/${nextLetter}`; },
    }, ['Próxima ›']),
  ]);

  const screen = el('div', { class: 'screen scene' }, [
    topBar(`${entry.letter} de ${entry.word}`, '/lucas'),
    stage,
    el('div', { class: 'scene__word' }, [`${entry.article} ${entry.word}`]),
    controls,
  ]);
  host.appendChild(screen);

  // Registro de progresso + narração automática de entrada.
  void (async () => {
    try {
      const rec = (await db.getLetter(entry.letter)) ?? {
        letter: entry.letter, visits: 0, interactions: 0, lastVisit: 0, favorite: false,
      };
      rec.visits += 1; rec.lastVisit = Date.now();
      await db.putLetter(rec);
      await db.addEvent({ area: 'lucas', kind: 'visit', ref: entry.letter, ts: Date.now() });
    } catch { /* persistência opcional */ }
  })();
  void narrate();
};
