export type ScreenFactory = (host: HTMLElement, params: Record<string, string>) => (() => void) | void;

interface Route { pattern: RegExp; keys: string[]; factory: ScreenFactory; }

/** Roteador por hash — funciona em GitHub Pages sem configuração de servidor. */
export class Router {
  private routes: Route[] = [];
  private cleanup: (() => void) | void = undefined;

  constructor(private host: HTMLElement, private fallback: ScreenFactory) {
    window.addEventListener('hashchange', () => this.resolve());
  }

  add(path: string, factory: ScreenFactory): this {
    const keys: string[] = [];
    const pattern = new RegExp(
      '^' + path.replace(/:[^/]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; }) + '$',
    );
    this.routes.push({ pattern, keys, factory });
    return this;
  }

  start(): void { this.resolve(); }

  navigate(path: string): void { window.location.hash = path; }

  private resolve(): void {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const path = raw.split('?')[0];
    for (const r of this.routes) {
      const m = r.pattern.exec(path);
      if (m) {
        const params: Record<string, string> = {};
        r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
        this.render(r.factory, params);
        return;
      }
    }
    this.render(this.fallback, {});
  }

  private render(factory: ScreenFactory, params: Record<string, string>): void {
    if (typeof this.cleanup === 'function') this.cleanup();
    this.host.innerHTML = '';
    this.cleanup = factory(this.host, params);
    this.host.scrollTop = 0;
  }
}
