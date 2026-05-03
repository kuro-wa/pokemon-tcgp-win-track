import type { MatchResult } from "./types";

const BASE_WIN_POINT = 10;
const BONUS_PER_STREAK = 3;
const MAX_BONUS_STREAK = 4;
// 暫定仕様: 負け時の減少値は固定。ランク帯別減少値は未実装。
const LOSE_POINT = -5;

/**
 * 試合結果と記録前連勝数からポイント増減値を計算する。
 * ポイント下限クランプは適用側の責務であり、この関数では行わない。
 */
export const calculatePointDelta = (
  result: MatchResult,
  winStreakBefore: number,
): number => {
  switch (result) {
    case "win":
      return BASE_WIN_POINT + Math.min(winStreakBefore, MAX_BONUS_STREAK) * BONUS_PER_STREAK;
    case "lose":
      return LOSE_POINT;
    case "draw":
      return 0;
  }
};
