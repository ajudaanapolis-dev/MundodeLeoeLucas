import { settings } from '@/accessibility/settings';
import { voicePath, scriptFor, type VoiceKind } from './narration';

/**
 * Motor de áudio:
 *  - desbloqueio no primeiro toque (Safari/iOS)
 *  - narração: voz gravada (se existir) OU síntese pt-BR (placeholder)
 *  - cancelamento da voz anterior
 *  - efeitos/sons de objeto sintetizados (Web Audio) — sem depender de arquivos
 *  - controle de volume, fallback e tratamento de erro
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private unlocked = false;
  private voiceEl: HTMLAudioElement | null = null;
  private fileCache = new Map<string, boolean>(); // path -> existe?

  unlock(): void {
    if (this.unlocked) return;
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) { this.ctx = new Ctor(); void this.ctx.resume(); }
      // Warm-up da síntese de fala (iOS exige gesto).
      if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
      this.unlocked = true;
    } catch (e) {
      console.warn('audio unlock falhou', e);
    }
  }

  private get volume(): number {
    return settings.get().volume;
  }

  stopVoice(): void {
    if (this.voiceEl) { this.voiceEl.pause(); this.voiceEl = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  /** Narra uma categoria para uma letra. Cancela voz anterior. */
  async say(kind: VoiceKind, letter: string): Promise<void> {
    if (!settings.get().narration) return;
    this.stopVoice();
    const path = voicePath(kind, letter);
    const exists = await this.hasFile(path);
    if (exists) return this.playFile(path);
    return this.speak(scriptFor(kind, letter));
  }

  /** Narra texto livre (usado por labs/painel). */
  async speakText(text: string): Promise<void> {
    if (!settings.get().narration) return;
    this.stopVoice();
    return this.speak(text);
  }

  private speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) { resolve(); return; }
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR';
        u.rate = 0.95;
        u.pitch = 1.15; // tom jovem/acolhedor
        u.volume = this.volume;
        const ptVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('pt'));
        if (ptVoice) u.voice = ptVoice;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      } catch { resolve(); }
    });
  }

  private async hasFile(path: string): Promise<boolean> {
    if (this.fileCache.has(path)) return this.fileCache.get(path)!;
    try {
      const res = await fetch(path, { method: 'HEAD' });
      const ok = res.ok && (res.headers.get('content-type')?.includes('audio') ?? true);
      this.fileCache.set(path, ok);
      return ok;
    } catch {
      this.fileCache.set(path, false);
      return false;
    }
  }

  private playFile(path: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const el = new Audio(path);
        el.volume = this.volume;
        this.voiceEl = el;
        el.onended = () => resolve();
        el.onerror = () => resolve();
        void el.play().catch(() => resolve());
      } catch { resolve(); }
    });
  }

  /** Efeito sonoro sintetizado (objetos/interações). Não é narração. */
  effect(kind: 'pop' | 'splash' | 'chime' | 'whoosh' | 'success', freq = 440): void {
    if (!settings.get().sound || !this.ctx) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      const map: Record<string, OscillatorType> = { pop: 'sine', splash: 'triangle', chime: 'sine', whoosh: 'sawtooth', success: 'sine' };
      osc.type = map[kind] ?? 'sine';
      const target = kind === 'success' ? freq * 1.5 : freq;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, target), now + 0.18);
      const peak = 0.25 * this.volume;
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('effect erro', e);
    }
  }

  /** Nota musical para xilofone etc. */
  note(freq: number, durationMs = 500): void {
    if (!settings.get().sound || !this.ctx) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.28 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch { /* ignore */ }
  }
}

export const audio = new AudioEngine();
