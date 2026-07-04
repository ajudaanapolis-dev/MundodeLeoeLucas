import type { ScreenFactory } from '@/app/Router';
import { el, svg } from '@/core/dom';
import { topBar } from '@/components/topbar';
import { leoSVG } from '@/characters/leo';
import { audio } from '@/audio/AudioEngine';
import { db, type LeoLabRecord } from '@/storage/db';
import { applyOutcome, computeMastery, type Stats } from '@/progress/progression';

interface Vars { temperatura: number; oxigenio: number; limpeza: number; comida: number; }
const IDEAL = {
  temperatura: [40, 70], oxigenio: [60, 100], limpeza: [60, 100], comida: [30, 70],
} as const;

const LAB_ID = 'aquario';

function inRange(v: number, [lo, hi]: readonly [number, number]) { return v >= lo && v <= hi; }

function diagnose(v: Vars): { balanced: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!inRange(v.temperatura, IDEAL.temperatura)) issues.push(v.temperatura > 70 ? 'Água quente demais: peixes na superfície.' : 'Água fria demais: peixes pouco ativos.');
  if (!inRange(v.oxigenio, IDEAL.oxigenio)) issues.push('Pouco oxigênio: ligue mais o filtro.');
  if (!inRange(v.limpeza, IDEAL.limpeza)) issues.push('Água turva com resíduos: faça a limpeza.');
  if (!inRange(v.comida, IDEAL.comida)) issues.push(v.comida > 70 ? 'Comida demais: sobra apodrece e suja a água.' : 'Pouca comida: peixes com fome.');
  return { balanced: issues.length === 0, issues };
}

function recordToStats(r: LeoLabRecord | undefined): Stats {
  return {
    level: r?.level ?? 1,
    attempts: r?.attempts ?? 0,
    correct: r?.correct ?? 0,
    hints: r?.hints ?? 0,
    conclusions: r?.conclusions ?? 0,
    recent: [],
  };
}

export const AquariumLab: ScreenFactory = (host) => {
  const vars: Vars = { temperatura: 55, oxigenio: 50, limpeza: 45, comida: 80 };
  let stats: Stats = { level: 1, attempts: 0, correct: 0, hints: 0, conclusions: 0, recent: [] };

  const stage = el('div', { class: 'scene__stage', style: 'min-height:220px;background:#BFE3EF;' });
  const leoArt = el('div', { style: 'position:absolute;right:8px;bottom:0;width:90px;' });
  leoArt.appendChild(svg(leoSVG('point')));
  stage.appendChild(leoArt);
  const waterSvg = svg(aquariumSVG(vars));
  stage.appendChild(waterSvg);
  stage.appendChild(leoArt);

  const feedback = el('div', { class: 'panel', role: 'status', 'aria-live': 'polite' }, ['Ajuste os controles e toque em Testar.']);
  const levelPill = el('span', { class: 'pill-note' }, ['Nível 1']);

  function redraw() {
    stage.querySelector('svg')?.remove();
    stage.prepend(svg(aquariumSVG(vars)));
  }

  function slider(label: string, key: keyof Vars) {
    const input = el('input', {
      type: 'range', min: '0', max: '100', value: String(vars[key]), class: 'slider',
      'aria-label': label,
      oninput: (e) => { vars[key] = Number((e.target as HTMLInputElement).value); redraw(); },
    });
    return el('label', { class: 'row', style: 'flex-direction:column;align-items:stretch;gap:4px;' }, [
      el('span', {}, [label]), input,
    ]);
  }

  async function test() {
    const { balanced, issues } = diagnose(vars);
    stats = applyOutcome(stats, { correct: balanced, usedHint: false, concluded: balanced });
    levelPill.textContent = `Nível ${stats.level}`;
    if (balanced) {
      audio.effect('success', 480);
      feedback.textContent = 'Aquário equilibrado! Peixes saudáveis e água limpa.';
      void audio.speakText('Muito bem! O aquário está equilibrado.');
    } else {
      audio.effect('pop', 240);
      feedback.textContent = issues.join(' ');
      void audio.speakText('Quase! Observe o que precisa mudar.');
    }
    try {
      const prev = await db.getLab(LAB_ID);
      const merged: LeoLabRecord = {
        labId: LAB_ID,
        level: stats.level,
        correct: (prev?.correct ?? 0) + (balanced ? 1 : 0),
        wrong: (prev?.wrong ?? 0) + (balanced ? 0 : 1),
        attempts: (prev?.attempts ?? 0) + 1,
        hints: prev?.hints ?? 0,
        experiments: (prev?.experiments ?? 0) + 1,
        conclusions: (prev?.conclusions ?? 0) + (balanced ? 1 : 0),
        masteryScore: computeMastery(stats),
        lastPlayed: Date.now(),
      };
      await db.putLab(merged);
      await db.addEvent({ area: 'leo', kind: balanced ? 'experiment-ok' : 'experiment-fail', ref: LAB_ID, ts: Date.now() });
    } catch { /* persistência opcional */ }
  }

  void (async () => {
    stats = recordToStats(await db.getLab(LAB_ID));
    levelPill.textContent = `Nível ${stats.level}`;
  })();

  const screen = el('div', { class: 'screen' }, [
    topBar('Laboratório do aquário', '/leo'),
    el('div', { class: 'row', style: 'justify-content:space-between;' }, [
      el('span', {}, ['Deixe a água boa para os peixes.']), levelPill,
    ]),
    stage,
    el('div', { class: 'panel' }, [
      slider('Temperatura', 'temperatura'),
      slider('Oxigênio (filtro)', 'oxigenio'),
      slider('Limpeza', 'limpeza'),
      slider('Comida', 'comida'),
    ]),
    feedback,
    el('div', { class: 'scene__controls' }, [
      el('button', { class: 'btn btn--accent', onclick: test }, ['🔬 Testar']),
    ]),
  ]);
  host.appendChild(screen);
};

function aquariumSVG(v: Vars): string {
  const turbid = v.limpeza < 60 || v.comida > 70;
  const water = turbid ? '#9FBFA6' : '#7FC3D8';
  const surfaceFish = v.temperatura > 70 || v.oxigenio < 60;
  const fishY = surfaceFish ? 70 : 150;
  return `
<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-label="Aquário">
  <rect x="10" y="20" width="300" height="190" rx="14" fill="${water}" stroke="#5E8AA8" stroke-width="6"/>
  <rect x="14" y="188" width="292" height="20" fill="#E6D2A8"/>
  <path d="M60 208 q-6 -60 6 -90 q8 34 2 90" fill="#5E8A4E" opacity="0.8"/>
  <path d="M250 208 q8 -50 -4 -80 q-8 30 -2 80" fill="#5E8A4E" opacity="0.8"/>
  <g fill="#F6A23B">
    <g transform="translate(150 ${fishY})"><ellipse rx="18" ry="10"/><path d="M16 0 l14 -8 v16 Z"/><circle cx="-8" cy="-2" r="2.5" fill="#3C3A4B"/></g>
    <g transform="translate(210 ${fishY + 24})"><ellipse rx="14" ry="8"/><path d="M12 0 l11 -6 v12 Z"/><circle cx="-6" cy="-1" r="2" fill="#3C3A4B"/></g>
  </g>
  ${turbid ? '<circle cx="90" cy="60" r="6" fill="#6E8F5E" opacity="0.5"/><circle cx="200" cy="50" r="8" fill="#6E8F5E" opacity="0.4"/>' : ''}
</svg>`;
}
