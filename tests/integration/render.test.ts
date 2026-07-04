import { describe, it, expect, beforeEach } from 'vitest';
import { HomeScreen } from '@/screens/HomeScreen';
import { AlphabetScreen } from '@/lucas/alphabet/AlphabetScreen';
import { SceneScreen } from '@/lucas/alphabet/SceneScreen';
import { LeoHome } from '@/leo/LeoHome';
import { AquariumLab } from '@/leo/labs/AquariumLab';
import { ParentDashboard } from '@/parent/ParentDashboard';
import { leoSVG } from '@/characters/leo';

function host() {
  const h = document.createElement('div');
  document.body.appendChild(h);
  return h;
}

describe('render smoke', () => {
  beforeEach(() => { document.body.innerHTML = ''; window.location.hash = ''; });

  it('personagem Léo contém marcador de moicano', () => {
    // O moicano é desenhado com traços verticais escuros no topo da cabeça.
    expect(leoSVG('neutral')).toContain('MOICANO');
  });

  it('monta a Home com as duas entradas', () => {
    HomeScreen(host(), {});
    expect(document.body.textContent).toContain('Jornada do Léo');
    expect(document.body.textContent).toContain('Mundo do Lucas');
  });

  it('monta o painel do alfabeto com 26 botões', () => {
    AlphabetScreen(host(), {});
    expect(document.querySelectorAll('.alpha-btn').length).toBe(26);
  });

  it('monta cenas próprias e de fallback sem erro', () => {
    for (const L of ['A', 'B', 'C', 'D', 'X', 'F', 'Z']) {
      document.body.innerHTML = '';
      SceneScreen(host(), { letter: L });
      expect(document.querySelector('.scene__stage svg')).toBeTruthy();
    }
  });

  it('monta a área do Léo e o laboratório do aquário', () => {
    LeoHome(host(), {});
    expect(document.body.textContent).toContain('Ecossistema do aquário');
    document.body.innerHTML = '';
    AquariumLab(host(), {});
    expect(document.querySelectorAll('input[type="range"]').length).toBe(4);
  });

  it('a área dos responsáveis exige desafio de adulto', () => {
    ParentDashboard(host(), {});
    expect(document.body.textContent).toContain('Só para responsáveis');
  });
});
