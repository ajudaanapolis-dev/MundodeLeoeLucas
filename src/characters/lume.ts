/** PROFESSOR LUME — guia adulto, acolhedor, explorador. Original, pastel. */
export type LumePose = 'neutral' | 'point' | 'celebrate' | 'think' | 'lupa';

export function lumeSVG(pose: LumePose = 'neutral'): string {
  const rightArm =
    pose === 'point'     ? 'M150 168 q40 -10 62 -2' :
    pose === 'celebrate' ? 'M150 168 q22 -40 12 -74' :
    pose === 'lupa'      ? 'M150 168 q34 6 46 34' :
    'M150 168 q26 22 22 56';
  const gadget = pose === 'lupa'
    ? `<g transform="translate(196 200)"><circle r="18" fill="none" stroke="#6C6A7C" stroke-width="6"/><circle r="12" fill="#CDE9F6" opacity="0.7"/><rect x="12" y="12" width="22" height="7" rx="3" transform="rotate(45 12 12)" fill="#6C6A7C"/></g>`
    : '';
  const brow = pose === 'think'
    ? '<path d="M92 96 q10 -8 20 -2" stroke="#6C6A7C" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : '';
  return `
<svg viewBox="0 0 260 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Professor Lume">
  <ellipse cx="130" cy="306" rx="70" ry="11" fill="#3C3A4B" opacity="0.12"/>
  <rect x="104" y="214" width="24" height="70" rx="12" fill="#8CA6C9"/>
  <rect x="132" y="214" width="24" height="70" rx="12" fill="#8CA6C9"/>
  <rect x="96" y="278" width="38" height="20" rx="10" fill="#6C6A7C"/>
  <rect x="126" y="278" width="38" height="20" rx="10" fill="#6C6A7C"/>
  <!-- jaleco/colete pastel -->
  <rect x="86" y="150" width="88" height="80" rx="28" fill="#D8C7EA"/>
  <rect x="120" y="150" width="20" height="80" fill="#EFE9F7"/>
  <path d="M110 168 q26 20 22 56" fill="none" stroke="#F1C7A6" stroke-width="18" stroke-linecap="round"/>
  <path d="${rightArm}" fill="none" stroke="#F1C7A6" stroke-width="18" stroke-linecap="round"/>
  <!-- cabeça -->
  <circle cx="130" cy="112" r="50" fill="#F6D3B4"/>
  <!-- cabelo/topete curioso -->
  <path d="M84 104 q10 -60 46 -60 q36 0 46 60 q-14 -30 -46 -30 q-32 0 -46 30 Z" fill="#7A5C46"/>
  <path d="M126 46 q6 -14 16 -8" stroke="#7A5C46" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- óculos redondos de explorador -->
  <circle cx="112" cy="112" r="15" fill="#EAF6FB" stroke="#6C6A7C" stroke-width="4"/>
  <circle cx="150" cy="112" r="15" fill="#EAF6FB" stroke="#6C6A7C" stroke-width="4"/>
  <line x1="127" y1="112" x2="135" y2="112" stroke="#6C6A7C" stroke-width="4"/>
  <circle cx="112" cy="112" r="4" fill="#3C3A4B"/>
  <circle cx="150" cy="112" r="4" fill="#3C3A4B"/>
  ${brow}
  <path d="${pose === 'celebrate' ? 'M112 136 q18 20 36 0' : 'M114 136 q16 12 32 0'}"
        stroke="#B5654A" stroke-width="4" fill="${pose === 'celebrate' ? '#B5654A' : 'none'}" stroke-linecap="round"/>
  <circle cx="100" cy="132" r="7" fill="#F6B8B0" opacity="0.6"/>
  <circle cx="160" cy="132" r="7" fill="#F6B8B0" opacity="0.6"/>
  ${gadget}
</svg>`;
}
