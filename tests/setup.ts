import 'fake-indexeddb/auto';

// Stubs mínimos para jsdom (áudio/voz não existem em ambiente de teste).
if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  });
}
if (!('speechSynthesis' in window)) {
  Object.defineProperty(window, 'speechSynthesis', {
    value: { getVoices: () => [], speak() {}, cancel() {} },
  });
}
