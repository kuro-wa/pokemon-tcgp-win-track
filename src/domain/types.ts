/** 試合結果 */
export type MatchResult = "win" | "lose" | "draw";

/** 1件の試合記録 */
export type MatchRecord = {
  readonly result: MatchResult;
  readonly pointBefore: number;
  readonly pointAfter: number;
  readonly winStreakBefore: number;
  readonly winStreakAfter: number;
  readonly timestamp: string;
};

/** 永続化対象のゲーム状態 */
export type GameState = {
  readonly point: number;
  readonly winStreak: number;
  readonly matchHistory: readonly MatchRecord[];
};

/** UI状態を含むアプリケーション全体の状態 */
export type AppState = {
  readonly gameState: GameState;
  readonly canUndo: boolean;
  readonly isStreamMode: boolean;
};

/** GameState の永続化契約 */
export type GameStateRepository = {
  readonly save: (state: GameState) => void;
  readonly load: () => GameState | null;
};

/** GameState の初期値 */
export const initialGameState: GameState = {
  point: 0,
  winStreak: 0,
  matchHistory: [],
};

/** AppState の初期値 */
export const initialAppState: AppState = {
  gameState: initialGameState,
  canUndo: false,
  isStreamMode: false,
};
