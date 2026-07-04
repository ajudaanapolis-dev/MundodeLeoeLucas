/**
 * PROGRESSÃO ADAPTATIVA — fórmula documentada.
 *
 * Objetivo: subir de nível reflete DOMÍNIO real, não volume de cliques.
 *
 * Entradas por laboratório:
 *   attempts   — tentativas de tarefas com resultado avaliável
 *   correct    — acertos
 *   hints      — dicas usadas
 *   experiments/conclusions — atividades de método científico concluídas
 *   recent[]   — janela dos últimos N resultados (1 = acerto, 0 = erro)
 *
 * masteryScore ∈ [0,1]:
 *   accOverall = correct / max(1, attempts)
 *   accRecent  = média(recent) na janela (peso maior no desempenho recente)
 *   hintRatio  = hints / max(1, attempts)
 *   expBonus   = min(1, conclusions / EXPECTED_CONCLUSIONS)
 *
 *   mastery = clamp(
 *       0.55*accRecent + 0.30*accOverall - 0.25*hintRatio + 0.05*expBonus,
 *       0, 1)
 *
 * Regras de nível (1..4):
 *   - Promoção exige MIN_ATTEMPTS no nível atual  (evita subir por cliques).
 *   - Promove se mastery ≥ PROMOTE e accRecent ≥ 0.75 e hintRatio ≤ 0.5.
 *   - Rebaixa se mastery < DEMOTE com MIN_ATTEMPTS cumpridas.
 *   - Sem promoção/rebaixamento fora dessas condições.
 */

export const RECENT_WINDOW = 8;
export const MIN_ATTEMPTS = 4;
export const EXPECTED_CONCLUSIONS = 3;
export const PROMOTE = 0.8;
export const DEMOTE = 0.35;
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 4;

export interface Stats {
  level: number;
  attempts: number;
  correct: number;
  hints: number;
  conclusions: number;
  recent: number[]; // 0/1, mais recentes no fim
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function computeMastery(s: Stats): number {
  const accOverall = s.correct / Math.max(1, s.attempts);
  const recent = s.recent.slice(-RECENT_WINDOW);
  const accRecent = recent.length ? mean(recent) : accOverall;
  const hintRatio = s.hints / Math.max(1, s.attempts);
  const expBonus = Math.min(1, s.conclusions / EXPECTED_CONCLUSIONS);
  const raw = 0.55 * accRecent + 0.30 * accOverall - 0.25 * hintRatio + 0.05 * expBonus;
  return clamp(raw, 0, 1);
}

export function recommendLevel(s: Stats): number {
  const mastery = computeMastery(s);
  const recent = s.recent.slice(-RECENT_WINDOW);
  const accRecent = recent.length ? mean(recent) : s.correct / Math.max(1, s.attempts);
  const hintRatio = s.hints / Math.max(1, s.attempts);

  let level = clamp(s.level, MIN_LEVEL, MAX_LEVEL);

  if (s.attempts >= MIN_ATTEMPTS) {
    if (mastery >= PROMOTE && accRecent >= 0.75 && hintRatio <= 0.5 && level < MAX_LEVEL) {
      level += 1;
    } else if (mastery < DEMOTE && level > MIN_LEVEL) {
      level -= 1;
    }
  }
  return level;
}

/** Registra um resultado e devolve os stats atualizados (imutável). */
export function applyOutcome(
  s: Stats,
  outcome: { correct: boolean; usedHint: boolean; concluded?: boolean },
): Stats {
  const recent = [...s.recent, outcome.correct ? 1 : 0].slice(-RECENT_WINDOW);
  const next: Stats = {
    ...s,
    attempts: s.attempts + 1,
    correct: s.correct + (outcome.correct ? 1 : 0),
    hints: s.hints + (outcome.usedHint ? 1 : 0),
    conclusions: s.conclusions + (outcome.concluded ? 1 : 0),
    recent,
  };
  next.level = recommendLevel(next);
  return next;
}
