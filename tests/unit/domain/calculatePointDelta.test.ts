import { describe, it, expect } from "vitest";
import { calculatePointDelta } from "../../../src/domain/calculatePointDelta";
import type { MatchResult } from "../../../src/domain/types";

describe("calculatePointDelta", () => {
  describe("勝ち時のポイント計算", () => {
    // D-01: 勝ち時の基本ポイント加算
    it("記録前連勝数0で勝った場合、+10を返す", () => {
      // Given: 記録前連勝数が0（初勝利）
      const result: MatchResult = "win";
      const winStreakBefore = 0;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 基本増加値10のみ（ボーナスなし）
      expect(delta).toBe(10);
    });

    // D-02: 連勝1回時のボーナス加算
    it("記録前連勝数1で勝った場合、+13を返す", () => {
      // Given: 記録前連勝数が1
      const result: MatchResult = "win";
      const winStreakBefore = 1;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 基本増加値10 + ボーナス3 = 13
      expect(delta).toBe(13);
    });

    // D-03: 連勝2回時のボーナス加算
    it("記録前連勝数2で勝った場合、+16を返す", () => {
      // Given: 記録前連勝数が2
      const result: MatchResult = "win";
      const winStreakBefore = 2;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 基本増加値10 + ボーナス6 = 16
      expect(delta).toBe(16);
    });

    // D-04: 連勝3回時のボーナス加算
    it("記録前連勝数3で勝った場合、+19を返す", () => {
      // Given: 記録前連勝数が3
      const result: MatchResult = "win";
      const winStreakBefore = 3;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 基本増加値10 + ボーナス9 = 19
      expect(delta).toBe(19);
    });

    // D-05: 連勝4回時のボーナス上限
    it("記録前連勝数4で勝った場合、+22を返す（ボーナス上限）", () => {
      // Given: 記録前連勝数が4
      const result: MatchResult = "win";
      const winStreakBefore = 4;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 基本増加値10 + ボーナス上限12 = 22
      expect(delta).toBe(22);
    });

    // D-06: 連勝5回以上でもボーナス上限は+12
    it("記録前連勝数10で勝った場合、+22を返す（ボーナス上限で固定）", () => {
      // Given: 記録前連勝数が10（4以上）
      const result: MatchResult = "win";
      const winStreakBefore = 10;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: ボーナスは上限+12で固定されるため22
      expect(delta).toBe(22);
    });

    // D-06 補足: 連勝5回でもボーナス上限確認
    it("記録前連勝数5で勝った場合、+22を返す", () => {
      // Given: 記録前連勝数が5
      const result: MatchResult = "win";
      const winStreakBefore = 5;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: ボーナスは上限+12で固定されるため22
      expect(delta).toBe(22);
    });
  });

  describe("負け時のポイント計算", () => {
    // D-07: 負け時のポイント減算
    it("負けた場合、-5を返す", () => {
      // Given: 試合結果が負け
      const result: MatchResult = "lose";
      const winStreakBefore = 0;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 固定で-5
      expect(delta).toBe(-5);
    });

    // D-07 補足: 連勝中に負けても減少値は変わらない
    it("連勝中に負けた場合でも、-5を返す", () => {
      // Given: 記録前連勝数が5の状態で負け
      const result: MatchResult = "lose";
      const winStreakBefore = 5;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 連勝数に関係なく固定で-5
      expect(delta).toBe(-5);
    });
  });

  describe("引き分け時のポイント計算", () => {
    // D-08: 引き分け時のポイント不変
    it("引き分けの場合、0を返す", () => {
      // Given: 試合結果が引き分け
      const result: MatchResult = "draw";
      const winStreakBefore = 0;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 変動なし
      expect(delta).toBe(0);
    });

    // D-08 補足: 連勝中の引き分けでもポイント変動なし
    it("連勝中に引き分けた場合でも、0を返す", () => {
      // Given: 記録前連勝数が3の状態で引き分け
      const result: MatchResult = "draw";
      const winStreakBefore = 3;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 変動なし
      expect(delta).toBe(0);
    });
  });

  describe("ポイント下限の境界値", () => {
    // D-09: ポイント下限0（負けで0未満にならない）
    // NOTE: calculatePointDelta 自体は増減値を返す関数。
    // ポイント下限0のクランプは適用側の責務だが、
    // 増減値が正しいことをここで検証する。
    it("負け時の増減値は常に-5である（下限クランプは適用側の責務）", () => {
      // Given: 試合結果が負け
      const result: MatchResult = "lose";
      const winStreakBefore = 0;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: -5を返す（適用時に currentPoint + delta で0未満ならクランプ）
      expect(delta).toBe(-5);
    });

    // D-11: ポイント上限なし（大きな値でも正常に計算）
    it("大きなポイント値でも正しい増減値を返す", () => {
      // Given: 記録前連勝数4（ボーナス上限）で勝ち
      const result: MatchResult = "win";
      const winStreakBefore = 4;

      // When: ポイント増減値を計算する
      const delta = calculatePointDelta(result, winStreakBefore);

      // Then: 上限なく+22を返す
      expect(delta).toBe(22);
    });
  });
});
