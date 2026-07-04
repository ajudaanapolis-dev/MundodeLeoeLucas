import { el } from '@/core/dom';

/** Desafio simples de adulto (multiplicação) antes do painel. */
export function adultGate(onPass: () => void): HTMLElement {
  const a = 3 + Math.floor(Math.random() * 6);
  const b = 3 + Math.floor(Math.random() * 6);
  const answer = a * b;

  const input = el('input', {
    type: 'number', inputmode: 'numeric', class: 'slider',
    style: 'height:56px;font-size:1.4rem;text-align:center;border-radius:16px;border:2px solid var(--c-sky);',
    'aria-label': 'Resposta',
  }) as HTMLInputElement;
  const msg = el('p', { role: 'alert', style: 'color:#B5654A;min-height:1.2em;' }, ['']);

  const check = () => {
    if (Number(input.value) === answer) onPass();
    else { msg.textContent = 'Resposta incorreta. Tente novamente.'; input.value = ''; input.focus(); }
  };

  return el('div', { class: 'panel', style: 'max-width:360px;margin:24px auto;text-align:center;' }, [
    el('h2', {}, ['Só para responsáveis']),
    el('p', {}, [`Para continuar, quanto é ${a} × ${b}?`]),
    input,
    msg,
    el('button', { class: 'btn btn--accent', style: 'margin-top:12px;', onclick: check }, ['Entrar']),
  ]);
}
