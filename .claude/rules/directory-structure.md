# Directory Structure Rules

## src/ 配下のレイヤー構成

- `src/domain/` — 型定義、計算ロジック、ビジネスルール。外部依存を一切持たない純粋な層。
- `src/feature/` — カスタムフック、状態管理。domain 層にのみ依存する。
- `src/ui/` — React コンポーネント。表示責務のみ。feature 層および domain 層に依存してよい。
- `src/infrastructure/` — LocalStorage、外部API、adapter、serialize/deserialize。domain 層が定義する契約に従って実装する。

## tests/ 配下の構成

- `tests/unit/` — 単一関数・単一モジュールの単体テスト。domain 層のロジック検証が中心。
- `tests/integration/` — 複数モジュール間の結合テスト。feature 層と infrastructure 層の連携検証が中心。
- `e2e/` — エンドツーエンドテスト。ユーザー操作シナリオの検証。

## 新規ファイル配置判断基準

1. そのコードは外部依存（LocalStorage、ブラウザAPI、外部API）を使うか？ → `src/infrastructure/`
2. そのコードは状態管理やカスタムフックか？ → `src/feature/`
3. そのコードは純粋な計算・型定義・ビジネスルールか？ → `src/domain/`
4. そのコードは画面表示に関するものか？ → `src/ui/`
5. 迷った場合は、依存関係が少ない方のレイヤーに配置する。
