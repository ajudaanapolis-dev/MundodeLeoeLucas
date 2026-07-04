import { el } from '@/core/dom';

/** Barra superior com botão voltar (grande) e título. */
export function topBar(title: string, backTo?: string): HTMLElement {
  const children: (HTMLElement | string)[] = [];
  if (backTo) {
    children.push(el('button', {
      class: 'btn btn--ghost', 'aria-label': 'Voltar',
      onclick: () => { window.location.hash = backTo; },
    }, ['‹ Voltar']));
  } else {
    children.push(el('span', {}, ['']));
  }
  children.push(el('span', { class: 'title' }, [title]));
  children.push(el('button', {
    class: 'btn btn--ghost', 'aria-label': 'Área dos responsáveis',
    onclick: () => { window.location.hash = '/pais'; },
  }, ['⚙']));
  return el('header', { class: 'topbar' }, children);
}
