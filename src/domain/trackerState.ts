import type { MatchResult } from "./types";
import { calculatePointDelta } from "./calculatePointDelta";

/** ポイントトラッカーの状態 */
export type TrackerState = {
  readonly point: number;
  readonly winStreak: number;
  readonly pointHistory: readonly number[];
  readonly startPoint: number;
  readonly previousState: {
    readonly point: number;
    readonly winStreak: number;
    readonly pointHistory: readonly number[];
  } | null;
};

/** 初期状態を生成する */
export const createInitialTrackerState = (startPoint: number): TrackerState => ({
  point: startPoint,
  winStreak: 0,
  pointHistory: [startPoint],
  startPoint,
  previousState: null,
});

/** 試合結果を適用して新しい状態を返す */
export const applyMatchResult = (
  state: TrackerState,
  result: MatchResult,
): TrackerState => {
  const delta = calculatePointDelta(result, state.winStreak);
  const newPoint = Math.max(0, state.point + delta);
  const newWinStreak = result === "win" ? state.winStreak + 1 : 0;

  return {
    ...state,
    point: newPoint,
    winStreak: newWinStreak,
    pointHistory: [...state.pointHistory, newPoint],
    previousState: {
      point: state.point,
      winStreak: state.winStreak,
      pointHistory: [...state.pointHistory],
    },
  };
};

/** 直前の操作を取り消す。previousState が null なら元の状態を返す */
export const undoLastResult = (state: TrackerState): TrackerState => {
  if (state.previousState === null) {
    return state;
  }
  return {
    ...state,
    point: state.previousState.point,
    winStreak: state.previousState.winStreak,
    pointHistory: [...state.previousState.pointHistory],
    previousState: null,
  };
};

/** 状態をスタートポイント基準の初期状態にリセットする */
export const resetTracker = (state: TrackerState): TrackerState =>
  createInitialTrackerState(state.startPoint);
