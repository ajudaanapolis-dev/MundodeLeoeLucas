import type { ScreenFactory } from '@/app/Router';
import { el } from '@/core/dom';
import { topBar } from '@/components/topbar';
import { adultGate } from './gate';
import { settings, type Prefs } from '@/accessibility/settings';
import { db } from '@/storage/db';
import { exportProgress, importProgress } from '@/storage/exportImport';

export const ParentDashboard: ScreenFactory = (host) => {
  const screen = el('div', { class: 'screen' }, [topBar('Responsáveis', '/')]);
  const body = el('div', {});
  screen.appendChild(body);
  host.appendChild(screen);

  body.appendChild(adultGate(() => { body.innerHTML = ''; renderDashboard(body); }));
};

function toggle(label: string, key: keyof Prefs): HTMLElement {
  const p = settings.get();
  const input = el('input', {
    type: 'checkbox', ...(p[key] ? { checked: 'checked' } : {}),
    onchange: (e) => settings.set({ [key]: (e.target as HTMLInputElement).checked } as Partial<Prefs>),
    style: 'width:28px;height:28px;',
  });
  return el('label', { class: 'row', style: 'justify-content:space-between;' }, [el('span', {}, [label]), input]);
}

async function renderDashboard(body: HTMLElement) {
  const [letters, labs] = await Promise.all([db.allLetters(), db.allLabs()]);
  const p = settings.get();

  const lucasPanel = el('div', { class: 'panel' }, [
    el('h3', {}, ['Lucas']),
    el('p', {}, [`Letras exploradas: ${letters.length} de 26`]),
    el('p', {}, [`Interações registradas: ${letters.reduce((s, l) => s + l.interactions, 0)}`]),
  ]);

  const leoPanel = el('div', { class: 'panel' }, [
    el('h3', {}, ['Léo']),
    ...(labs.length
      ? labs.map((l) => el('p', {}, [`${l.labId}: nível ${l.level} — ${l.correct} acertos, ${l.wrong} erros, ${l.experiments} experimentos`]))
      : [el('p', {}, ['Nenhum laboratório concluído ainda.'])]),
  ]);

  const volume = el('input', {
    type: 'range', min: '0', max: '100', value: String(Math.round(p.volume * 100)), class: 'slider',
    'aria-label': 'Volume',
    oninput: (e) => settings.set({ volume: Number((e.target as HTMLInputElement).value) / 100 }),
  });

  const settingsPanel = el('div', { class: 'panel' }, [
    el('h3', {}, ['Ajustes']),
    toggle('Som e efeitos', 'sound'),
    toggle('Narração (voz)', 'narration'),
    toggle('Reduzir movimento', 'reducedMotion'),
    toggle('Alto contraste', 'highContrast'),
    el('label', { class: 'row', style: 'flex-direction:column;align-items:stretch;' }, [el('span', {}, ['Volume']), volume]),
  ]);

  const dataPanel = el('div', { class: 'panel' }, [
    el('h3', {}, ['Dados']),
    el('div', { class: 'row' }, [
      el('button', { class: 'btn btn--peach', onclick: doExport }, ['Exportar JSON']),
      el('button', { class: 'btn btn--peach', onclick: doImport }, ['Importar JSON']),
      el('button', { class: 'btn btn--ghost', onclick: doReset }, ['Apagar progresso']),
    ]),
    el('p', { id: 'data-msg', style: 'color:var(--text-soft);min-height:1.2em;' }, ['']),
  ]);

  body.append(lucasPanel, leoPanel, settingsPanel, dataPanel);
}

async function doExport() {
  const bundle = await exportProgress();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mundo-leo-lucas-progresso.json'; a.click();
  URL.revokeObjectURL(url);
}

function doImport() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'application/json';
  input.onchange = async () => {
    const file = input.files?.[0]; if (!file) return;
    const text = await file.text();
    const res = await importProgress(text);
    const msg = document.getElementById('data-msg');
    if (msg) msg.textContent = res.ok ? 'Progresso importado com sucesso.' : `Falha: ${res.error}`;
  };
  input.click();
}

async function doReset() {
  const ok = confirm('Apagar todo o progresso? Esta ação não pode ser desfeita.');
  if (!ok) return;
  await db.clearAll();
  const msg = document.getElementById('data-msg');
  if (msg) msg.textContent = 'Progresso apagado.';
}
