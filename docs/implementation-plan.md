# 実装タスク分解書 — Pokemon TCGP Win Track

---

## 1. 実装方針概要

### テストベース開発（TDD）

すべての機能実装において、テストコードを先に作成し、そのテストを通過させる最小実装を行う。
テスト未作成の機能は実装してはならない。各タスク内で「テスト作成 → テスト失敗確認 → 最小実装 → テスト通過確認」のサイクルを回す。

### レイヤー順の実装

以下の順序で実装を進める。

1. **Domain** — 外部依存のない純粋ロジック。他レイヤーの前提となる
2. **Feature** — Domain ロジックを組み合わせた状態管理。Repository はインターフェース経由で利用し、テスト時はモックで検証する
3. **Infrastructure** — Domain 層が定義する契約に従い永続化を実装。Feature 層への組み込み（永続化連携）もこのフェーズで行う
4. **UI** — Feature 層から提供される状態・操作を画面に反映
5. **E2E** — 全層を結合したユーザーシナリオ検証

この順序により、各レイヤーが依存先を先に確定でき、手戻りを最小化できる。
Infrastructure を Feature の後にしているのは、Feature 層は Domain 層にのみ依存し、Repository インターフェース（Domain 層定義）を通じて永続化と疎結合に連携するためである。

### MVP優先

要件定義書（requirements.md）の必須機能 F-1〜F-8 のみを対象とし、除外機能には一切着手しない。

---

## 2. 前提技術方針

| 区分 | 技術 |
|------|------|
| フロントエンド | React + TypeScript + Vite |
| UI ライブラリ | Tailwind CSS + shadcn/ui |
| グラフ | Recharts |
| 永続化 | LocalStorage |
| Unit / Integration テスト | Vitest |
| UI テスト | React Testing Library |
| E2E テスト | Playwright |

---

## 3. タスク粒度の基準

- 1タスクは1責務を原則とする
- テスト作成と実装は同一タスク内で TDD サイクルとして実行する（テスト → 実装の順）
- 1タスクで新規作成するファイルはテスト＋実装のペアに限定する
- UI タスクはコンポーネント単位で分割する
- Domain ロジックは関数単位で分割する

---

## 4. タスク一覧

### Phase 1: プロジェクト基盤

#### T-001: Vite + React + TypeScript プロジェクト初期化・ディレクトリ構成整備

- **目的**: 開発基盤の構築とレイヤー構成の物理ディレクトリ整備
- **対象レイヤー**: 全体
- **依存タスク**: なし
- **実施内容**:
  - Vite で React + TypeScript プロジェクトを作成
  - tsconfig の strict モード有効化
  - 不要な初期ファイル（App.css, logo 等）を削除
  - `src/domain/`, `src/feature/`, `src/ui/`, `src/infrastructure/` ディレクトリ作成
  - `tests/unit/domain/`, `tests/unit/ui/`, `tests/integration/`, `e2e/` ディレクトリ作成
  - 各ディレクトリに `.gitkeep` を配置
  - `npm run dev` / `npm run build` の動作確認
- **完了条件**: `npm run dev` で空のページが表示され、`npm run build` が成功し、全ディレクトリが存在する
- **テスト観点**: ビルドの成功確認（手動）
- **優先度**: High
- **作成/更新ファイルパス**:
  - `package.json`
  - `tsconfig.json`
  - `vite.config.ts`
  - `src/main.tsx`
  - `src/domain/.gitkeep`
  - `src/feature/.gitkeep`
  - `src/ui/.gitkeep`
  - `src/infrastructure/.gitkeep`
  - `tests/unit/domain/.gitkeep`
  - `tests/unit/ui/.gitkeep`
  - `tests/integration/.gitkeep`
  - `e2e/.gitkeep`

#### T-002: Tailwind CSS + shadcn/ui + Recharts 導入

- **目的**: UI ライブラリとグラフライブラリの導入
- **対象レイヤー**: UI
- **依存タスク**: T-001
- **実施内容**:
  - Tailwind CSS のインストール・設定
  - shadcn/ui の初期化・設定
  - Recharts のインストール
  - 動作確認用の最小コンポーネントで表示確認
- **完了条件**: Tailwind のユーティリティクラス、shadcn/ui コンポーネント、Recharts がそれぞれ利用可能な状態
- **テスト観点**: スタイル適用とインポートの目視確認
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tailwind.config.js`（または `tailwind.config.ts`）
  - `postcss.config.js`
  - `src/index.css`（Tailwind ディレクティブ追加）
  - `components.json`（shadcn/ui 設定）
  - `package.json`（依存追加）

#### T-003: テスト環境構築（Vitest + React Testing Library + Playwright）

- **目的**: 全テストフレームワークの設定
- **対象レイヤー**: 全体
- **依存タスク**: T-001
- **実施内容**:
  - Vitest のインストール・設定（vitest.config.ts）
  - React Testing Library のインストール
  - jsdom 環境の設定
  - Playwright のインストール・設定（playwright.config.ts）
  - `npx vitest run` でサンプルテストが通ることを確認
  - Playwright サンプルテスト実行確認
- **完了条件**: `npx vitest run` と Playwright テストが正常終了する
- **テスト観点**: サンプルテストの実行成功
- **優先度**: High
- **作成/更新ファイルパス**:
  - `vitest.config.ts`
  - `playwright.config.ts`
  - `package.json`（依存追加）

---

### Phase 2: Domain 設計・実装

#### T-004: Domain 型定義

- **目的**: アプリケーション全体で使用する型と Repository インターフェースを定義する
- **対象レイヤー**: Domain
- **依存タスク**: T-001
- **実施内容**:
  - `MatchResult` 型（`"win" | "lose" | "draw"`）
  - `MatchRecord` 型（result, pointBefore, pointAfter, winStreakBefore, winStreakAfter, timestamp）
  - `GameState` 型（point, winStreak, matchHistory）
  - `GameStateRepository` インターフェース（save, load）
- **完了条件**: 型定義ファイルが作成され、コンパイルエラーがない
- **テスト観点**: TypeScript コンパイルの成功
- **優先度**: High
- **作成/更新ファイルパス**:
  - `src/domain/types.ts`

#### T-005: ポイント計算ロジック（テスト → 実装）

- **目的**: 勝敗と連勝数に基づくポイント増減値の計算ロジックを TDD で実装する
- **対象レイヤー**: Domain
- **依存タスク**: T-004, T-003
- **実施内容**:
  - テスト作成: 勝ち時の基本加算（+10）、連勝ボーナス（連勝1〜4+）、負け時の減算（-5）、引き分け時の不変（0）、ポイント下限0の境界値、ポイント上限なしの確認
  - テスト失敗確認
  - 最小実装: 勝利時 `基本増加値(10) + min(記録前連勝数, 4)`、敗北時 `-5`、引き分け時 `0`
  - ポイント適用関数（下限0クランプ）も実装
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: D-01〜D-11
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/domain/calculatePointDelta.test.ts`
  - `src/domain/calculatePointDelta.ts`

#### T-006: 連勝数計算ロジック（テスト → 実装）

- **目的**: 試合結果に基づく連勝数の更新ロジックを TDD で実装する
- **対象レイヤー**: Domain
- **依存タスク**: T-004, T-003
- **実施内容**:
  - テスト作成: 勝ちで+1、連続勝利で累積、負けでリセット、引き分けでリセット、0の状態での負け・引き分け
  - テスト失敗確認
  - 最小実装: 勝利時 `現在の連勝数 + 1`、敗北・引き分け時 `0`
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: D-12〜D-17
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/domain/calculateWinStreak.test.ts`
  - `src/domain/calculateWinStreak.ts`

#### T-007: 試合結果反映ロジック（テスト → 実装）

- **目的**: 現在の GameState と MatchResult から新しい状態と MatchRecord を生成するロジックを TDD で実装する
- **対象レイヤー**: Domain
- **依存タスク**: T-005, T-006
- **実施内容**:
  - テスト作成: 勝ち・負け・引き分け時の試合記録生成（pointBefore/After, winStreakBefore/After の正確性）、timestamp の ISO 8601 形式確認、仕様書 3.7 の計算例シナリオ
  - テスト失敗確認
  - 最小実装: calculatePointDelta, calculateWinStreak を内部利用し、新しい GameState と MatchRecord を返す
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: D-18〜D-21, D-26
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/domain/applyMatchResult.test.ts`
  - `src/domain/applyMatchResult.ts`

#### T-008: Undo ロジック（テスト → 実装）

- **目的**: 直前の試合記録を取り消し、状態を復元するロジックを TDD で実装する
- **対象レイヤー**: Domain
- **依存タスク**: T-004, T-003
- **実施内容**:
  - テスト作成: ポイントの復元（pointBefore）、連勝数の復元（winStreakBefore）、履歴末尾の削除、履歴1件の状態での Undo
  - テスト失敗確認
  - 最小実装: matchHistory 末尾を取り除き、pointBefore / winStreakBefore で復元した新しい GameState を返す
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: D-22〜D-25
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/domain/undoLastMatch.test.ts`
  - `src/domain/undoLastMatch.ts`

---

### Phase 3: Feature 実装

#### T-009: 状態管理 hook（テスト → 実装）

- **目的**: 勝敗入力・Undo・canUndo 状態管理を統合するカスタムフックを TDD で実装する
- **対象レイヤー**: Feature
- **依存タスク**: T-007, T-008
- **実施内容**:
  - テスト作成: 勝ち/負け/引き分け入力後の point, winStreak, matchHistory 更新、Undo 後の状態復元、canUndo の遷移（false → 記録後 true → Undo 後 false）
  - テスト失敗確認
  - 最小実装: useState で GameState と canUndo を管理、recordMatch で applyMatchResult を呼び出し、undo で undoLastMatch を呼び出す
  - Repository 依存は注入可能にする（テスト容易性のため）。この段階ではモックまたはダミーで検証
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: F-01〜F-06
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/integration/useMatchTracker.test.ts`
  - `src/feature/useMatchTracker.ts`

#### T-010: 配信モード切替 hook（テスト → 実装）

- **目的**: 配信モードの ON/OFF 切替を管理するカスタムフックを TDD で実装する
- **対象レイヤー**: Feature
- **依存タスク**: T-003
- **実施内容**:
  - テスト作成: トグル ON で isStreamMode = true、トグル OFF で isStreamMode = false、切替時に point/winStreak が変化しないこと、初期値が false であること
  - テスト失敗確認
  - 最小実装: useState で isStreamMode を管理（初期値 false）、toggleStreamMode 関数を提供、LocalStorage への保存は行わない
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: F-07〜F-09, F-14
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/integration/useStreamMode.test.ts`
  - `src/feature/useStreamMode.ts`

---

### Phase 4: Infrastructure 実装

#### T-011: LocalStorage serialize/deserialize（テスト → 実装）

- **目的**: GameState の直列化・復元とフォールバック処理を TDD で実装する
- **対象レイヤー**: Infrastructure
- **依存タスク**: T-004, T-003
- **実施内容**:
  - テスト作成: GameState → JSON 文字列の変換、JSON 文字列 → GameState の復元、不正 JSON のフォールバック、構造不正データのフォールバック、null / undefined のフォールバック
  - テスト失敗確認
  - 最小実装: serialize 関数（GameState → JSON 文字列）、deserialize 関数（JSON 文字列 → GameState、型ガード検証付き、失敗時は初期値を返す）
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: F-15〜F-17 に関連するデータ変換部分
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/infrastructure/serializeGameState.test.ts`
  - `src/infrastructure/serializeGameState.ts`

#### T-012: LocalStorage repository（テスト → 実装）

- **目的**: LocalStorage を介した永続化操作を TDD で実装する
- **対象レイヤー**: Infrastructure
- **依存タスク**: T-011
- **実施内容**:
  - テスト作成: save で GameState を LocalStorage に保存できること、load で GameState を読み込めること、キー不在時に初期値を返すこと、破損データ時に初期値を返すこと、書き込み失敗時に例外をスローすること、保存キーが `"pokemon-tcgp-win-track"` であること
  - テスト失敗確認
  - 最小実装: Domain 層の GameStateRepository インターフェースに従い実装。save で serialize → localStorage.setItem、load で localStorage.getItem → deserialize
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: F-10〜F-12, F-15〜F-18
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/infrastructure/gameStateRepository.test.ts`
  - `src/infrastructure/gameStateRepository.ts`

#### T-013: 永続化連携（テスト → hook 更新）

- **目的**: Feature 層の useMatchTracker に永続化機能を組み込み、起動時の復元・保存・フォールバックを TDD で実装する
- **対象レイヤー**: Feature + Infrastructure
- **依存タスク**: T-009, T-012
- **実施内容**:
  - テスト作成: 試合記録時に LocalStorage に保存されること、Undo 時に LocalStorage に保存されること、起動時に LocalStorage から状態が復元されること、起動時に canUndo が false であること、LocalStorage が空の場合に初期値で起動すること、JSON 破損時に初期値で起動すること、書き込み失敗時にアプリが継続動作すること
  - テスト失敗確認
  - useMatchTracker に永続化を組み込み: 初期化時 repository.load で復元、recordMatch/undo 後 repository.save で保存、書き込み失敗時のエラーコールバック通知
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: F-10〜F-18
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/integration/useMatchTrackerWithPersistence.test.ts`
  - `src/feature/useMatchTracker.ts`（更新）

---

### Phase 5: UI 実装

#### T-014: ヘッダーコンポーネント（テスト → 実装）

- **目的**: アプリ名と配信モード切替ボタンを表示するヘッダーを TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003
- **実施内容**:
  - テスト作成: アプリ名 "Pokemon TCGP Win Track" が表示されること、配信モード切替ボタンが表示されること、切替ボタン押下でコールバックが呼ばれること
  - テスト失敗確認
  - 最小実装: アプリ名表示、配信モード切替ボタン（Props でコールバック受け取り）
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-07
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/ui/Header.test.tsx`
  - `src/ui/Header.tsx`

#### T-015: ステータス表示コンポーネント（テスト → 実装）

- **目的**: 現在ポイントと連勝数の表示（通常/配信モード対応）を TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003
- **実施内容**:
  - テスト作成: ポイントが "{数値} pt" 形式で表示されること、連勝数が "{数値} 連勝" 形式で表示されること、配信モード時に拡大表示されること（フォントサイズ2倍以上）
  - テスト失敗確認
  - 最小実装: Props（point, winStreak, isStreamMode）に基づく表示。通常モード: 標準フォント、配信モード: 2倍以上のフォントサイズ
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-01, U-02, U-11〜U-16, U-22
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/ui/StatusDisplay.test.tsx`
  - `src/ui/StatusDisplay.tsx`

#### T-016: 入力ボタンコンポーネント（テスト → 実装）

- **目的**: 勝敗入力ボタンと Undo ボタンの表示・操作を TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003
- **実施内容**:
  - テスト作成: Win/Lose/Draw ボタンが表示されること、Undo ボタンが表示されること、canUndo=false 時に Undo が disabled であること、canUndo=true 時に Undo が活性であること、各ボタンクリックでコールバックが呼ばれること、配信モード時に Undo が非表示であること
  - テスト失敗確認
  - 最小実装: Props（onWin, onLose, onDraw, onUndo, canUndo, isStreamMode）に基づく表示・制御
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-05, U-06, U-08〜U-10, U-23, U-26
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/ui/MatchInputButtons.test.tsx`
  - `src/ui/MatchInputButtons.tsx`

#### T-017: 履歴一覧コンポーネント（テスト → 実装）

- **目的**: 試合履歴の一覧表示を TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003, T-004
- **実施内容**:
  - テスト作成: 履歴が新しい順で表示されること、1行に試合結果・変動値・記録後ポイント・時刻が表示されること、履歴0件時に空状態であること、配信モード時に非表示であること
  - テスト失敗確認
  - 最小実装: Props（matchHistory, isStreamMode）に基づき時系列降順で表示。各行: 試合結果、変動値（"+10", "-5", "0"）、記録後ポイント（"→ 120 pt"）、時刻（"HH:MM"）
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-04, U-17〜U-19, U-25
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/ui/MatchHistory.test.tsx`
  - `src/ui/MatchHistory.tsx`

#### T-018: グラフコンポーネント（テスト → 実装）

- **目的**: ポイント推移の折れ線グラフ表示を TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003, T-004
- **実施内容**:
  - テスト作成: グラフが表示されること、試合記録0件時に原点のみ表示されること、配信モード時に非表示であること
  - テスト失敗確認
  - 最小実装: Props（matchHistory, isStreamMode）に基づき Recharts LineChart を使用。X軸: 試合番号（0始まり）、Y軸: ポイント。データ: 原点（0, 0）+ 各試合の pointAfter
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-03, U-20, U-21, U-24
- **優先度**: Medium
- **作成/更新ファイルパス**:
  - `tests/unit/ui/PointChart.test.tsx`
  - `src/ui/PointChart.tsx`

#### T-019: エラートースト通知コンポーネント（テスト → 実装）

- **目的**: エラー通知のトースト表示を TDD で実装する
- **対象レイヤー**: UI
- **依存タスク**: T-002, T-003
- **実施内容**:
  - テスト作成: LocalStorage 読み込み失敗メッセージが表示されること、書き込み失敗メッセージが表示されること、通知が操作を妨げないこと、技術的エラーメッセージが表示されないこと
  - テスト失敗確認
  - 最小実装: Props（message, isVisible, onClose）による非モーダルなトースト表示
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-29〜U-31
- **優先度**: Medium
- **作成/更新ファイルパス**:
  - `tests/unit/ui/ErrorToast.test.tsx`
  - `src/ui/ErrorToast.tsx`

#### T-020: App コンポーネント組み立て（テスト → 実装）

- **目的**: 全コンポーネントを統合した画面を TDD で構築する
- **対象レイヤー**: UI
- **依存タスク**: T-009, T-010, T-014〜T-019
- **実施内容**:
  - テスト作成: 初期状態で全要素が表示されること、配信モード切替で表示/非表示が正しく切り替わること、勝敗ボタン操作後に画面が更新されること
  - テスト失敗確認
  - 最小実装: useMatchTracker, useStreamMode を使用。Header, StatusDisplay, MatchInputButtons, PointChart, MatchHistory, ErrorToast を配置。レイアウト順序: ヘッダー → ステータス → 入力 → グラフ → 履歴
  - テスト通過確認
- **完了条件**: 全テストが通過する
- **テスト観点**: U-01〜U-07, U-22〜U-28
- **優先度**: High
- **作成/更新ファイルパス**:
  - `tests/unit/ui/App.test.tsx`
  - `src/ui/App.tsx`

#### T-021: レスポンシブ対応

- **目的**: モバイル端末（320px〜）での表示・操作を確保する
- **対象レイヤー**: UI
- **依存タスク**: T-020
- **実施内容**:
  - 各コンポーネントに Tailwind のレスポンシブクラスを適用
  - 320px 幅での表示確認
  - ボタンの折り返し対応
  - グラフの幅伸縮対応
- **完了条件**: 320px 幅で全機能が操作可能であること（NF-4 準拠）
- **テスト観点**: NF-4（目視確認）
- **優先度**: Medium
- **作成/更新ファイルパス**:
  - `src/ui/Header.tsx`（更新）
  - `src/ui/StatusDisplay.tsx`（更新）
  - `src/ui/MatchInputButtons.tsx`（更新）
  - `src/ui/PointChart.tsx`（更新）
  - `src/ui/MatchHistory.tsx`（更新）
  - `src/ui/App.tsx`（更新）

---

### Phase 6: E2E テスト・最終確認

#### T-022: E2E — 初期起動・基本操作・計算シナリオ

- **目的**: 初期起動、基本的な勝敗入力、連勝ボーナス、計算例の E2E テストを作成・実行する
- **対象レイヤー**: 全層
- **依存タスク**: T-020, T-003
- **実施内容**:
  - E-01: 初期起動（ポイント 0pt、連勝数 0連勝、履歴空、グラフ原点のみ）
  - E-02: 勝ち入力 → 画面更新
  - E-03: 連勝 → ポイント・連勝数の正しい推移
  - E-04: 負け入力 → 画面更新
  - E-05: 引き分け入力 → 画面更新
  - E-13: ポイント下限テスト
  - E-14: 仕様書の計算例フルシナリオ
  - E-16: 初期状態で Undo ボタン disabled
- **完了条件**: 全テストが通過する
- **テスト観点**: E-01〜E-05, E-13, E-14, E-16
- **優先度**: High
- **作成/更新ファイルパス**:
  - `e2e/basicOperationAndCalculation.spec.ts`

#### T-023: E2E — Undo・永続化

- **目的**: Undo 操作、リロード後の復元、破損データフォールバックの E2E テストを作成・実行する
- **対象レイヤー**: 全層
- **依存タスク**: T-020, T-003
- **実施内容**:
  - E-06: Undo 操作（ポイント・連勝数の復元、履歴削除）
  - E-07: 連続 Undo 不可
  - E-08: リロード後の復元
  - E-09: LocalStorage 破損時のフォールバック
- **完了条件**: 全テストが通過する
- **テスト観点**: E-06〜E-09
- **優先度**: High
- **作成/更新ファイルパス**:
  - `e2e/undoAndPersistence.spec.ts`

#### T-024: E2E — 配信モード・履歴表示

- **目的**: 配信モード切替と履歴表示順の E2E テストを作成・実行する
- **対象レイヤー**: 全層
- **依存タスク**: T-020, T-003
- **実施内容**:
  - E-10: 通常→配信モード切替
  - E-11: 配信→通常モード切替
  - E-12: 配信モードで勝敗入力
  - E-15: 履歴表示順確認（最新が最上部）
- **完了条件**: 全テストが通過する
- **テスト観点**: E-10〜E-12, E-15
- **優先度**: High
- **作成/更新ファイルパス**:
  - `e2e/streamModeAndHistory.spec.ts`

#### T-025: 全テスト一括実行・最終動作確認

- **目的**: 全テストの通過確認と最終動作確認
- **対象レイヤー**: 全層
- **依存タスク**: T-022〜T-024
- **実施内容**:
  - `npx vitest run` で全 unit / integration テスト通過確認
  - Playwright で全 E2E テスト通過確認
  - `npm run build` でビルド成功確認
  - モバイル表示の目視確認（320px）
  - 配信モードの目視確認
- **完了条件**: 全テスト通過、ビルド成功、目視確認完了
- **テスト観点**: 全テストケース
- **優先度**: High
- **作成/更新ファイルパス**: なし（確認のみ）

---

## 5. 推奨実行順

Claude Code への依頼順序として、以下の順番を推奨する。

| 順序 | タスクID | タスク名 | フェーズ |
|------|---------|---------|---------|
| 1 | T-001 | プロジェクト初期化・ディレクトリ構成 | Phase 1 |
| 2 | T-002 | Tailwind + shadcn/ui + Recharts 導入 | Phase 1 |
| 3 | T-003 | テスト環境構築 | Phase 1 |
| 4 | T-004 | Domain 型定義 | Phase 2 |
| 5 | T-005 | ポイント計算ロジック | Phase 2 |
| 6 | T-006 | 連勝数計算ロジック | Phase 2 |
| 7 | T-007 | 試合結果反映ロジック | Phase 2 |
| 8 | T-008 | Undo ロジック | Phase 2 |
| 9 | T-009 | 状態管理 hook | Phase 3 |
| 10 | T-010 | 配信モード切替 hook | Phase 3 |
| 11 | T-011 | serialize/deserialize | Phase 4 |
| 12 | T-012 | LocalStorage repository | Phase 4 |
| 13 | T-013 | 永続化連携 | Phase 4 |
| 14 | T-014 | ヘッダー | Phase 5 |
| 15 | T-015 | ステータス表示 | Phase 5 |
| 16 | T-016 | 入力ボタン | Phase 5 |
| 17 | T-017 | 履歴一覧 | Phase 5 |
| 18 | T-018 | グラフ | Phase 5 |
| 19 | T-019 | エラートースト | Phase 5 |
| 20 | T-020 | App 組み立て | Phase 5 |
| 21 | T-021 | レスポンシブ対応 | Phase 5 |
| 22 | T-022 | E2E — 基本操作・計算 | Phase 6 |
| 23 | T-023 | E2E — Undo・永続化 | Phase 6 |
| 24 | T-024 | E2E — 配信モード・履歴 | Phase 6 |
| 25 | T-025 | 全テスト・最終確認 | Phase 6 |

---

## 6. テストケースとタスクの対応表

| テストID | 対応タスク |
|---------|----------|
| D-01〜D-11 | T-005 |
| D-12〜D-17 | T-006 |
| D-18〜D-21, D-26 | T-007 |
| D-22〜D-25 | T-008 |
| F-01〜F-06 | T-009 |
| F-07〜F-09, F-14 | T-010 |
| F-10〜F-18 | T-013 |
| F-15〜F-17（データ変換部分） | T-011 |
| F-10〜F-12, F-15〜F-18（永続化操作部分） | T-012 |
| U-01, U-02, U-11〜U-16, U-22 | T-015 |
| U-03, U-20, U-21, U-24 | T-018 |
| U-04, U-17〜U-19, U-25 | T-017 |
| U-05〜U-10, U-23, U-26 | T-016 |
| U-07 | T-014 |
| U-22〜U-28 | T-020 |
| U-29〜U-31 | T-019 |
| E-01〜E-05, E-13, E-14, E-16 | T-022 |
| E-06〜E-09 | T-023 |
| E-10〜E-12, E-15 | T-024 |

---

## 7. リスク・注意点

### React コンポーネントにロジックを書きすぎるリスク

ポイント計算、連勝数計算、Undo 処理などのビジネスロジックを React コンポーネント内に直接記述してしまうと、テスト困難になり、domain 層の意味がなくなる。すべてのロジックは domain 層の純粋関数に委譲すること。

### LocalStorage を UI から直接触るリスク

LocalStorage への読み書きを UI コンポーネントや feature hook 内で直接行うと、infrastructure 層の隔離が崩壊する。必ず repository を介してアクセスすること。

### Domain と UI の責務混在リスク

ポイント変動値の表示フォーマット（"+10", "-5"）やタイムスタンプの表示フォーマット（"HH:MM"）は UI 層の責務。domain 層の MatchRecord にフォーマット済み文字列を持たせてはならない。

### テスト未作成のまま実装を始めるリスク

TDD の順序を崩すと、テストが後付けになり、仕様との乖離が検出されなくなる。各タスクで「テスト作成 → テスト失敗確認 → 実装 → テスト通過確認」の順序を厳守すること。

### 配信モード実装時に通常モード仕様を壊すリスク

配信モードの表示/非表示切替を実装する際に、通常モードの既存テストが壊れないことを確認すること。配信モードの UI 表示は isStreamMode の Props 切替のみで制御し、状態ロジック側に影響を与えないこと。

### 永続化の書き込み失敗を無視するリスク

LocalStorage の容量超過等で書き込みが失敗した場合、アプリは継続動作しなければならない。エラーを握りつぶすのではなく、ユーザーに通知した上で、メモリ上の状態は正常に保持すること。

---

## 8. 将来拡張の扱い

以下の機能は **MVP タスクに含めない**。本タスク分解書の対象外とする。

| 除外機能 | 除外理由 |
|---------|---------|
| デッキ管理 | 要件定義書で除外（勝敗記録に責務を限定） |
| 対戦履歴詳細 | 要件定義書で除外（入力コスト増大） |
| 詳細分析機能 | 要件定義書で除外（MVP では推移グラフで十分） |
| クラウド同期 | 要件定義書で除外（オフライン完結を優先） |
| セッション区切り | 画面仕様書で将来拡張案として記載 |
| データエクスポート | 画面仕様書で将来拡張案として記載 |

---

## 9. 改善提案

### 提案1: Domain 層にフォーマット用ヘルパーを検討

履歴表示のポイント変動値フォーマット（"+10", "-5", "0"）は複数の UI コンポーネントで利用される可能性がある。domain 層に表示用の変換関数を配置するか、UI 層内で共通化するかを、UI 実装フェーズ開始前に判断するとよい。ただし、フォーマットは UI 責務であるため domain 層に置く場合は慎重に検討すること。

### 提案2: Repository インターフェースのエラー通知設計

T-009 で Repository を注入可能にする際、書き込み失敗時のエラー通知方法（コールバック、例外、Result 型）を早期に決定しておくと、T-013 の永続化連携がスムーズになる。

### 提案3: E2E テストの並列実行設定

Playwright の並列実行設定を T-003 の段階で有効にしておくと、Phase 6 の E2E テスト実行時間を短縮できる。
