export type Area = 'lucas' | 'leo';

export interface LetterEntry {
  letter: string;        // "A"
  word: string;          // "Axolote"
  article: string;       // "O" | "A"
  fact: string;          // frase educativa
  palette: { bg: string; accent: string };
  hasBespokeScene: boolean; // true = cena própria implementada
}

export interface Mountable {
  mount(host: HTMLElement): void;
  unmount?(): void;
}
