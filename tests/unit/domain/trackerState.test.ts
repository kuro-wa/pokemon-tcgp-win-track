import { describe, it, expect } from "vitest";
import {
  createInitialTrackerState,
  applyMatchResult,
  undoLastResult,
  resetTracker,
} from "../../../src/domain/trackerState";

describe("createInitialTrackerState", () => {
  it("スタートポイント0で初期状態を生成する", () => {
    const state = createInitialTrackerState(0);

    expect(state.point).toBe(0);
    expect(state.winStreak).toBe(0);
    expect(state.pointHistory).toEqual([0]);
    expect(state.startPoint).toBe(0);
    expect(state.previousState).toBeNull();
  });

  it("スタートポイント50で初期状態を生成する", () => {
    const state = createInitialTrackerState(50);

    expect(state.point).toBe(50);
    expect(state.winStreak).toBe(0);
    expect(state.pointHistory).toEqual([50]);
    expect(state.startPoint).toBe(50);
    expect(state.previousState).toBeNull();
  });
});

describe("applyMatchResult", () => {
  it("Win適用でポイント+10、連勝+1、履歴追加", () => {
    const state = createInitialTrackerState(0);
    const next = applyMatchResult(state, "win");

    expect(next.point).toBe(10);
    expect(next.winStreak).toBe(1);
    expect(next.pointHistory).toEqual([0, 10]);
  });

  it("Lose適用でポイント-5（0未満にならない）、連勝リセット", () => {
    const state = createInitialTrackerState(0);
    const next = applyMatchResult(state, "lose");

    expect(next.point).toBe(0);
    expect(next.winStreak).toBe(0);
    expect(next.pointHistory).toEqual([0, 0]);
  });

  it("Draw適用でポイント変動なし、連勝リセット", () => {
    const state = createInitialTrackerState(50);
    const next = applyMatchResult(state, "draw");

    expect(next.point).toBe(50);
    expect(next.winStreak).toBe(0);
    expect(next.pointHistory).toEqual([50, 50]);
  });

  it("連勝ボーナスが正しく計算される（連勝2→+16）", () => {
    let state = createInitialTrackerState(0);
    state = applyMatchResult(state, "win"); // streak 0→1, +10
    state = applyMatchResult(state, "win"); // streak 1→2, +13
    state = applyMatchResult(state, "win"); // streak 2→3, +16

    expect(state.point).toBe(10 + 13 + 16);
    expect(state.winStreak).toBe(3);
  });

  it("previousState に操作前の状態が保存される", () => {
    const state = createInitialTrackerState(100);
    const next = applyMatchResult(state, "win");

    expect(next.previousState).not.toBeNull();
    expect(next.previousState!.point).toBe(100);
    expect(next.previousState!.winStreak).toBe(0);
    expect(next.previousState!.pointHistory).toEqual([100]);
  });

  it("スタートポイント50からLoseしてもポイントは45になる", () => {
    const state = createInitialTrackerState(50);
    const next = applyMatchResult(state, "lose");

    expect(next.point).toBe(45);
  });

  it("ポイント3からLoseすると0にクランプされる", () => {
    const state = { ...createInitialTrackerState(3) };
    const next = applyMatchResult(state, "lose");

    expect(next.point).toBe(0);
  });
});

describe("undoLastResult", () => {
  it("Win後のUndoで元のポイントと連勝数に戻る", () => {
    const initial = createInitialTrackerState(0);
    const afterWin = applyMatchResult(initial, "win");
    const undone = undoLastResult(afterWin);

    expect(undone.point).toBe(0);
    expect(undone.winStreak).toBe(0);
    expect(undone.pointHistory).toEqual([0]);
  });

  it("Lose後のUndoで元に戻る", () => {
    const initial = createInitialTrackerState(50);
    const afterLose = applyMatchResult(initial, "lose");
    const undone = undoLastResult(afterLose);

    expect(undone.point).toBe(50);
    expect(undone.winStreak).toBe(0);
    expect(undone.pointHistory).toEqual([50]);
  });

  it("Draw後のUndoで元に戻る", () => {
    const initial = createInitialTrackerState(30);
    const afterDraw = applyMatchResult(initial, "draw");
    const undone = undoLastResult(afterDraw);

    expect(undone.point).toBe(30);
    expect(undone.winStreak).toBe(0);
    expect(undone.pointHistory).toEqual([30]);
  });

  it("Undo対象がない場合は状態が変わらない", () => {
    const initial = createInitialTrackerState(0);
    const undone = undoLastResult(initial);

    expect(undone).toBe(initial);
  });

  it("Undo後はpreviousStateがnullになる（多段Undo不可）", () => {
    const initial = createInitialTrackerState(0);
    const afterWin = applyMatchResult(initial, "win");
    const undone = undoLastResult(afterWin);

    expect(undone.previousState).toBeNull();
  });

  it("連勝中のUndoで連勝数も復元される", () => {
    let state = createInitialTrackerState(0);
    state = applyMatchResult(state, "win"); // streak 1
    state = applyMatchResult(state, "win"); // streak 2
    const undone = undoLastResult(state);

    expect(undone.winStreak).toBe(1);
    expect(undone.point).toBe(10);
  });

  it("スタートポイント50 → Win → Undo で50に戻る", () => {
    const initial = createInitialTrackerState(50);
    const afterWin = applyMatchResult(initial, "win");
    const undone = undoLastResult(afterWin);

    expect(undone.point).toBe(50);
    expect(undone.winStreak).toBe(0);
    expect(undone.pointHistory).toEqual([50]);
  });
});

describe("resetTracker", () => {
  it("何試合か記録した後リセットで初期状態に戻る", () => {
    let state = createInitialTrackerState(0);
    state = applyMatchResult(state, "win");
    state = applyMatchResult(state, "win");
    state = applyMatchResult(state, "lose");
    const reset = resetTracker(state);

    expect(reset.point).toBe(0);
    expect(reset.winStreak).toBe(0);
    expect(reset.pointHistory).toEqual([0]);
    expect(reset.previousState).toBeNull();
    expect(reset.startPoint).toBe(0);
  });

  it("スタートポイント50で記録後リセットすると50に戻る", () => {
    let state = createInitialTrackerState(50);
    state = applyMatchResult(state, "win");
    state = applyMatchResult(state, "lose");
    const reset = resetTracker(state);

    expect(reset.point).toBe(50);
    expect(reset.winStreak).toBe(0);
    expect(reset.pointHistory).toEqual([50]);
    expect(reset.startPoint).toBe(50);
  });
});

describe("組み合わせテスト", () => {
  it("スタートポイント50適用 → Win → Undo で50に戻る", () => {
    const state = createInitialTrackerState(50);
    const afterWin = applyMatchResult(state, "win");

    expect(afterWin.point).toBe(60);

    const undone = undoLastResult(afterWin);

    expect(undone.point).toBe(50);
    expect(undone.winStreak).toBe(0);
  });

  it("スタートポイント50適用 → 数試合 → リセットで50に戻る", () => {
    let state = createInitialTrackerState(50);
    state = applyMatchResult(state, "win");
    state = applyMatchResult(state, "win");
    state = applyMatchResult(state, "lose");
    const reset = resetTracker(state);

    expect(reset.point).toBe(50);
    expect(reset.winStreak).toBe(0);
    expect(reset.pointHistory).toEqual([50]);
  });
});
