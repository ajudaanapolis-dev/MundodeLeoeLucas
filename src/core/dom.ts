/** Helpers mínimos de DOM/SVG — sem framework, controle direto para animação. */
export type Attrs = Record<string, string | number | boolean | EventListener | undefined>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  applyAttrs(node, attrs);
  for (const c of children) node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return node;
}

export function svg(markup: string): SVGElement {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  return doc.documentElement as unknown as SVGElement;
}

function applyAttrs(node: HTMLElement, attrs: Attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (k === 'class') {
      node.className = String(v);
    } else if (k === 'html') {
      node.innerHTML = String(v);
    } else {
      node.setAttribute(k, String(v));
    }
  }
}

export function clear(node: HTMLElement) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** Toque/click unificado, com feedback tátil opcional. */
export function onTap(node: Element, handler: (e: Event) => void) {
  node.addEventListener('click', handler);
}
