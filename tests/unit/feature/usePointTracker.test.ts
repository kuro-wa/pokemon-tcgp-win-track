import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePointTracker } from "../../../src/feature/usePointTracker";

describe("usePointTracker", () => {
  it("初期状態はポイント0、連勝0、Undo不可", () => {
    const { result } = renderHook(() => usePointTracker());

    expect(result.current.point).toBe(0);
    expect(result.current.winStreak).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.pointHistory).toEqual([0]);
    expect(result.current.startPoint).toBe(0);
  });

  it("recordResult('win')でポイント+10、連勝+1", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));

    expect(result.current.point).toBe(10);
    expect(result.current.winStreak).toBe(1);
    expect(result.current.canUndo).toBe(true);
  });

  it("recordResult('lose')でポイント変動、連勝リセット", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));
    act(() => result.current.recordResult("lose"));

    expect(result.current.point).toBe(5);
    expect(result.current.winStreak).toBe(0);
  });

  it("undoで直前の操作を取り消せる", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));
    expect(result.current.point).toBe(10);

    act(() => result.current.undo());
    expect(result.current.point).toBe(0);
    expect(result.current.winStreak).toBe(0);
    expect(result.current.canUndo).toBe(false);
  });

  it("undo後はcanUndoがfalseになる", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));
    act(() => result.current.undo());

    expect(result.current.canUndo).toBe(false);
  });

  it("resetで初期状態に戻る", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));
    act(() => result.current.recordResult("win"));
    act(() => result.current.reset());

    expect(result.current.point).toBe(0);
    expect(result.current.winStreak).toBe(0);
    expect(result.current.pointHistory).toEqual([0]);
    expect(result.current.canUndo).toBe(false);
  });

  it("applyStartPointでスタートポイントを変更しリセットされる", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.recordResult("win"));
    act(() => result.current.applyStartPoint(50));

    expect(result.current.point).toBe(50);
    expect(result.current.winStreak).toBe(0);
    expect(result.current.pointHistory).toEqual([50]);
    expect(result.current.startPoint).toBe(50);
    expect(result.current.canUndo).toBe(false);
  });

  it("スタートポイント50 → Win → Undo で50に戻る", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.applyStartPoint(50));
    act(() => result.current.recordResult("win"));
    expect(result.current.point).toBe(60);

    act(() => result.current.undo());
    expect(result.current.point).toBe(50);
    expect(result.current.winStreak).toBe(0);
  });

  it("スタートポイント50 → 数試合 → リセットで50に戻る", () => {
    const { result } = renderHook(() => usePointTracker());

    act(() => result.current.applyStartPoint(50));
    act(() => result.current.recordResult("win"));
    act(() => result.current.recordResult("lose"));
    act(() => result.current.reset());

    expect(result.current.point).toBe(50);
    expect(result.current.winStreak).toBe(0);
    expect(result.current.pointHistory).toEqual([50]);
  });
});
