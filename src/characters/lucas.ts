/** LUCAS — bebê menino de 1 ano, alegre, movimentos suaves. Original, pastel. */
export type LucasPose = 'neutral' | 'clap' | 'point' | 'dance';

export function lucasSVG(pose: LucasPose = 'neutral'): string {
  const arms =
    pose === 'clap'
      ? '<path d="M74 150 q30 -6 36 8 q6 -14 36 -8" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>'
      : pose === 'point'
        ? '<path d="M74 150 q-20 14 -18 40" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/><path d="M146 150 q34 -4 52 -18" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>'
        : '<path d="M74 150 q-22 16 -16 44" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/><path d="M146 150 q22 16 16 44" fill="none" stroke="#F1C7A6" stroke-width="14" stroke-linecap="round"/>';

  return `
<svg viewBox="0 0 220 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lucas, bebê menino de 1 ano">
  <ellipse cx="110" cy="286" rx="54" ry="9" fill="#3C3A4B" opacity="0.12"/>

  <!-- pernas: macacão azul -->
  <rect x="90" y="196" width="18" height="52" rx="9" fill="#8DB9D3"/>
  <rect x="112" y="196" width="18" height="52" rx="9" fill="#8DB9D3"/>

  <!-- sapatinhos -->
  <rect x="84" y="242" width="28" height="16" rx="8" fill="#FFFFFF"/>
  <rect x="108" y="242" width="28" height="16" rx="8" fill="#FFFFFF"/>

  <!-- corpo: macacão azul suave -->
  <rect x="72" y="146" width="76" height="66" rx="30" fill="#A8D8EA"/>

  ${arms}

  <!-- cabeça -->
  <circle cx="110" cy="108" r="44" fill="#F6D3B4"/>

  <!-- cabelo curto de bebê menino -->
  <path d="M78 92 q16 -34 40 -32 q24 2 32 30 q-16 -12 -36 -12 q-22 0 -36 14 Z" fill="#6B4E3D"/>
  <path d="M92 70 q12 -16 26 -4 q-14 0 -26 4 Z" fill="#6B4E3D"/>
  <circle cx="84" cy="96" r="7" fill="#6B4E3D"/>
  <circle cx="136" cy="96" r="7" fill="#6B4E3D"/>

  <!-- olhos -->
  <circle cx="96" cy="110" r="6" fill="#3C3A4B"/>
  <circle cx="124" cy="110" r="6" fill="#3C3A4B"/>
  <circle cx="97.5" cy="108" r="2" fill="#fff"/>
  <circle cx="125.5" cy="108" r="2" fill="#fff"/>

  <!-- sorriso -->
  <path d="M100 126 q10 10 20 0" stroke="#B5654A" stroke-width="4" fill="none" stroke-linecap="round"/>

  <!-- bochechas suaves -->
  <circle cx="86" cy="122" r="6" fill="#E9B5A3" opacity="0.45"/>
  <circle cx="134" cy="122" r="6" fill="#E9B5A3" opacity="0.45"/>

  <!-- detalhe do macacão -->
  <circle cx="96" cy="166" r="5" fill="#FFFFFF" opacity="0.9"/>
  <circle cx="124" cy="166" r="5" fill="#FFFFFF" opacity="0.9"/>
</svg>`;
}
