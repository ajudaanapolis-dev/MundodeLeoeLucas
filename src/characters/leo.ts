/**
 * LÉO — menino ~4 anos, cabelo em MOICANO claramente visível, curioso/investigativo.
 * Personagem original. Roupas pastéis, tênis. Poses via parâmetro.
 */
export type LeoPose = 'neutral' | 'lupa' | 'point' | 'celebrate' | 'think';

export function leoSVG(pose: LeoPose = 'neutral'): string {
  const arm =
    pose === 'celebrate' ? 'M118 150 q-24 -34 -14 -66' :
    pose === 'point'     ? 'M118 150 q40 -6 66 -18' :
    pose === 'lupa'      ? 'M118 150 q30 6 44 30' :
    'M118 150 q26 20 20 52';
  const extra =
    pose === 'lupa'
      ? `<g transform="translate(150 176)"><circle r="20" fill="none" stroke="#6C6A7C" stroke-width="6"/><circle r="14" fill="#CDE9F6" opacity="0.7"/><rect x="14" y="14" width="26" height="8" rx="4" transform="rotate(45 14 14)" fill="#6C6A7C"/></g>`
      : '';
  return `
<svg viewBox="0 0 220 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Léo, menino de moicano">
  <ellipse cx="110" cy="286" rx="60" ry="10" fill="#3C3A4B" opacity="0.12"/>
  <!-- pernas -->
  <rect x="86" y="196" width="20" height="60" rx="10" fill="#8FB7C9"/>
  <rect x="114" y="196" width="20" height="60" rx="10" fill="#8FB7C9"/>
  <!-- tênis -->
  <rect x="80" y="250" width="32" height="18" rx="9" fill="#FBE7A1"/>
  <rect x="110" y="250" width="32" height="18" rx="9" fill="#FBE7A1"/>
  <!-- corpo / camiseta pastel -->
  <rect x="74" y="140" width="72" height="72" rx="26" fill="#A9CBA4"/>
  <!-- braços -->
  <path d="${arm}" fill="none" stroke="#F1C7A6" stroke-width="16" stroke-linecap="round"/>
  <path d="M96 150 q-26 20 -20 52" fill="none" stroke="#F1C7A6" stroke-width="16" stroke-linecap="round"/>
  <!-- cabeça -->
  <circle cx="110" cy="104" r="46" fill="#F6D3B4"/>
  <!-- orelhas -->
  <circle cx="66" cy="106" r="9" fill="#F1C7A6"/>
  <circle cx="154" cy="106" r="9" fill="#F1C7A6"/>
  <!-- MOICANO (claramente visível) -->
  <path d="M110 40 C104 54 104 62 110 70 C116 62 116 54 110 40 Z" fill="#5B4636"/>
  <path d="M96 60 q14 -30 28 0 q-4 -6 -14 -8 q-10 2 -14 8 Z" fill="#6E543F"/>
  <path d="M100 62 L100 46 M110 64 L110 38 M120 62 L120 46"
        stroke="#5B4636" stroke-width="8" stroke-linecap="round"/>
  <path d="M92 66 q18 -14 36 0" fill="none" stroke="#5B4636" stroke-width="10" stroke-linecap="round"/>
  <!-- laterais raspadas (sombra do cabelo) -->
  <path d="M74 92 q6 -22 20 -30" stroke="#E7C8A6" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M146 92 q-6 -22 -20 -30" stroke="#E7C8A6" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- olhos curiosos -->
  <circle cx="94" cy="106" r="7" fill="#3C3A4B"/>
  <circle cx="126" cy="106" r="7" fill="#3C3A4B"/>
  <circle cx="96" cy="104" r="2.5" fill="#fff"/>
  <circle cx="128" cy="104" r="2.5" fill="#fff"/>
  <!-- sobrancelhas (expressão investigativa) -->
  <path d="M86 94 q8 -5 16 -1" stroke="#5B4636" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M118 93 q8 -4 16 1" stroke="#5B4636" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- boca -->
  <path d="${pose === 'celebrate' ? 'M96 124 q14 18 28 0' : 'M98 124 q12 10 24 0'}"
        stroke="#B5654A" stroke-width="4" fill="${pose === 'celebrate' ? '#B5654A' : 'none'}" stroke-linecap="round"/>
  <circle cx="84" cy="120" r="6" fill="#F6B8B0" opacity="0.6"/>
  <circle cx="136" cy="120" r="6" fill="#F6B8B0" opacity="0.6"/>
  ${extra}
</svg>`;
}
