import { EventBus } from '@/core/events';

export interface Prefs {
  sound: boolean;         // efeitos e música
  narration: boolean;     // voz
  volume: number;         // 0..1
  reducedMotion: boolean; // sobrepõe prefers-reduced-motion
  highContrast: boolean;
  sessionMinutes: number; // 0 = sem limite
}

const DEFAULTS: Prefs = {
  sound: true,
  narration: true,
  volume: 0.8,
  reducedMotion: false,
  highContrast: false,
  sessionMinutes: 0,
};

const KEY = 'mll.prefs.v1';

type Events = { change: Prefs };

/** Preferências vivem em localStorage (não em IndexedDB), conforme especificação. */
export class Settings {
  private prefs: Prefs;
  readonly bus = new EventBus<Events>();

  constructor() {
    this.prefs = this.load();
    this.apply();
  }

  private load(): Prefs {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw) as Partial<Prefs>;
      return { ...DEFAULTS, ...parsed };
    } catch {
      return { ...DEFAULTS };
    }
  }

  get(): Readonly<Prefs> { return this.prefs; }

  set(patch: Partial<Prefs>): void {
    this.prefs = { ...this.prefs, ...patch };
    try { localStorage.setItem(KEY, JSON.stringify(this.prefs)); } catch { /* modo privado */ }
    this.apply();
    this.bus.emit('change', this.prefs);
  }

  private apply(): void {
    const root = document.documentElement;
    root.dataset.reducedMotion = String(this.prefs.reducedMotion);
    root.dataset.contrast = this.prefs.highContrast ? 'high' : 'normal';
  }
}

export const settings = new Settings();
