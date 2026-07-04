import type { ScreenFactory } from '@/app/Router';
import { el, svg } from '@/core/dom';
import { lumeSVG } from '@/characters/lume';
import { leoSVG } from '@/characters/leo';
import { lucasSVG } from '@/characters/lucas';
import { audio } from '@/audio/AudioEngine';

/** Tela inicial: guia (Lume) + duas entradas (Jornada do Léo / Mundo do Lucas). */
export const HomeScreen: ScreenFactory = (host) => {
  const guide = el('div', { style: 'max-width:180px;margin:0 auto;' });
  guide.appendChild(svg(lumeSVG('point')));

  const leoCard = el('button', {
    class: 'entry-card entry-card--leo',
    onclick: () => { audio.effect('chime', 440); window.location.hash = '/leo'; },
  }, [
    el('h2', {}, ['Jornada do Léo']),
    el('p', {}, ['Laboratórios de ciência para investigar e descobrir.']),
  ]);
  const leoArt = el('div', { style: 'width:120px;align-self:flex-end;' });
  leoArt.appendChild(svg(leoSVG('lupa')));
  leoCard.appendChild(leoArt);

  const lucasCard = el('button', {
    class: 'entry-card entry-card--lucas',
    onclick: () => { audio.effect('chime', 520); window.location.hash = '/lucas'; },
  }, [
    el('h2', {}, ['Mundo do Lucas']),
    el('p', {}, ['Toque, som e movimento com as letras e os bichos.']),
  ]);
  const lucasArt = el('div', { style: 'width:120px;align-self:flex-end;' });
  lucasArt.appendChild(svg(lucasSVG('clap')));
  lucasCard.appendChild(lucasArt);

  const screen = el('div', { class: 'screen' }, [
    el('h1', { style: 'text-align:center;' }, ['Mundo de Léo e Lucas']),
    guide,
    el('div', { class: 'entry-grid' }, [leoCard, lucasCard]),
    el('button', {
      class: 'btn btn--ghost', style: 'align-self:center;margin-top:8px;',
      onclick: () => { window.location.hash = '/pais'; },
    }, ['Área dos responsáveis']),
  ]);
  host.appendChild(screen);
};
