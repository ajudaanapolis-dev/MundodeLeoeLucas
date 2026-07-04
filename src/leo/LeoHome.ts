import type { ScreenFactory } from '@/app/Router';
import { el, svg } from '@/core/dom';
import { topBar } from '@/components/topbar';
import { leoSVG } from '@/characters/leo';
import { audio } from '@/audio/AudioEngine';

const LABS = [
  { id: 'aquario', name: 'Ecossistema do aquário', ready: true, desc: 'Equilibre a água e cuide dos peixes.' },
  { id: 'carnivoras', name: 'Plantas carnívoras', ready: true, desc: 'Teste luz, água e alimento.' },
  { id: 'invertebrados', name: 'Invertebrados', ready: true, desc: 'Observe e classifique animais.' },
  { id: 'axolotes', name: 'Axolotes', ready: true, desc: 'Cuide da água e observe as brânquias.' },
  { id: 'metodo', name: 'Método científico', ready: true, desc: 'Crie hipóteses e experimente.' },
];

export const LeoHome: ScreenFactory = (host) => {
  const leoArt = el('div', { style: 'width:120px;margin:0 auto;' });
  leoArt.appendChild(svg(leoSVG('think')));

  const cards = LABS.map((lab) =>
    el('button', {
      class: 'panel tappable',
      style: 'text-align:left;border:none;width:100%;' + (lab.ready ? '' : 'opacity:0.55;'),
      'aria-label': lab.name + (lab.ready ? '' : ' (em construção)'),
      onclick: () => {
        if (!lab.ready) { audio.effect('pop', 200); return; }
        audio.effect('chime', 440);
        window.location.hash = `/leo/${lab.id}`;
      },
    }, [
      el('h3', {}, [lab.name]),
      el('p', { style: 'margin:0;color:var(--text-soft);' }, [lab.desc]),
    ]),
  );

  const screen = el('div', { class: 'screen' }, [
    topBar('Jornada do Léo', '/'),
    leoArt,
    el('p', { style: 'text-align:center;' }, ['Escolha um laboratório para investigar.']),
    ...cards,
  ]);
  host.appendChild(screen);
};
