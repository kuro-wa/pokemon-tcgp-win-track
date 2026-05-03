import { useState, useCallback } from "react";
import type { MatchResult } from "../domain/types";
import {
  createInitialTrackerState,
  applyMatchResult,
  undoLastResult,
  resetTracker,
  type TrackerState,
} from "../domain/trackerState";

type UsePointTrackerReturn = {
  readonly point: number;
  readonly winStreak: number;
  readonly pointHistory: readonly number[];
  readonly startPoint: number;
  readonly canUndo: boolean;
  readonly recordResult: (result: MatchResult) => void;
  readonly undo: () => void;
  readonly reset: () => void;
  readonly applyStartPoint: (startPoint: number) => void;
};

export const usePointTracker = (): UsePointTrackerReturn => {
  const [state, setState] = useState<TrackerState>(() =>
    createInitialTrackerState(0),
  );

  const recordResult = useCallback((result: MatchResult) => {
    setState((prev) => applyMatchResult(prev, result));
  }, []);

  const undo = useCallback(() => {
    setState((prev) => undoLastResult(prev));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => resetTracker(prev));
  }, []);

  const applyStartPoint = useCallback((startPoint: number) => {
    setState(createInitialTrackerState(startPoint));
  }, []);

  return {
    point: state.point,
    winStreak: state.winStreak,
    pointHistory: [...state.pointHistory],
    startPoint: state.startPoint,
    canUndo: state.previousState !== null,
    recordResult,
    undo,
    reset,
    applyStartPoint,
  };
};
