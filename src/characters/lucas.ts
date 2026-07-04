/** LUCAS — criança pequena, alegre, movimentos suaves. Original, pastel. */
export type LucasPose = 'neutral' | 'clap' | 'point' | 'dance';

export function lucasSVG(pose: LucasPose = 'neutral'): string {
  const arms =
    pose === 'clap' ? '<path d="M74 150 q30 -6 36 8 q6 -14 36 -8" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>'
    : pose === 'point' ? '<path d="M74 150 q-20 14 -18 40" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/><path d="M146 150 q34 -4 52 -18" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>'
    : '<path d="M74 150 q-22 16 -16 44" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/><path d="M146 150 q22 16 16 44" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>';
  return `
<svg viewBox="0 0 220 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lucas, criança pequena">
  <ellipse cx="110" cy="286" rx="54" ry="9" fill="#3C3A4B" opacity="0.12"/>
  <rect x="90" y="196" width="18" height="52" rx="9" fill="#E9A6C0"/>
  <rect x="112" y="196" width="18" height="52" rx="9" fill="#E9A6C0"/>
  <rect x="84" y="242" width="28" height="16" rx="8" fill="#FFFFFF"/>
  <rect x="108" y="242" width="28" height="16" rx="8" fill="#FFFFFF"/>
  <rect x="72" y="146" width="76" height="66" rx="30" fill="#F6C1CF"/>
  ${arms}
  <circle cx="110" cy="108" r="44" fill="#F6D3B4"/>
  <!-- tufo de cabelo macio -->
  <path d="M92 74 q18 -20 36 0 q-6 -6 -18 -6 q-12 0 -18 6 Z" fill="#7A5C46"/>
  <circle cx="110" cy="66" r="8" fill="#7A5C46"/>
  <circle cx="96" cy="110" r="6" fill="#3C3A4B"/>
  <circle cx="124" cy="110" r="6" fill="#3C3A4B"/>
  <circle cx="97.5" cy="108" r="2" fill="#fff"/>
  <circle cx="125.5" cy="108" r="2" fill="#fff"/>
  <path d="M100 126 q10 10 20 0" stroke="#B5654A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="86" cy="122" r="7" fill="#F6B8B0" opacity="0.7"/>
  <circle cx="134" cy="122" r="7" fill="#F6B8B0" opacity="0.7"/>
</svg>`;
}
