/**
 * ROTEIROS DE NARRAÇÃO (pt-BR) e mapa de arquivos de voz.
 *
 * Três categorias por letra:
 *   1. nome da letra           -> voice/letters/<L>.wav
 *   2. "A de Axolote"          -> voice/words/<L>.wav
 *   3. frase educativa         -> voice/facts/<L>.wav
 *
 * Enquanto os arquivos gravados não existem, o motor usa síntese de fala
 * pt-BR (voz real falada) como PLACEHOLDER — nunca um bip.
 * Para trocar por voz gravada, basta adicionar os .wav nos caminhos abaixo.
 */
import { LETTERS } from '@/lucas/alphabet/data';

export type VoiceKind = 'letters' | 'words' | 'facts';

export function voicePath(kind: VoiceKind, letter: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  return `${base}assets/audio/voice/${kind}/${letter.toUpperCase()}.wav`;
}

export function scriptFor(kind: VoiceKind, letter: string): string {
  const entry = LETTERS.find((l) => l.letter === letter.toUpperCase());
  if (!entry) return letter;
  switch (kind) {
    case 'letters': return entry.letter;
    case 'words':   return `${entry.letter} de ${entry.word}`;
    case 'facts':   return entry.fact;
  }
}
