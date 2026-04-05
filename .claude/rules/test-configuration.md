# Test Configuration Rules

## 使用テストフレームワーク

- Vitest を使用すること。

## テスト区分

- **unit**: 単一関数・単一モジュールのテスト。外部依存なし。高速に実行可能であること。
- **integration**: 複数モジュールの結合テスト。infrastructure 層のモック差し替えを含む。
- **e2e**: ブラウザ上のユーザー操作シナリオテスト。

## テストファイル命名規則

- テストファイル名は `{対象モジュール名}.test.ts` または `{対象モジュール名}.test.tsx` とすること。
- テスト対象のファイル名と一致させること。

## テストファイル配置ルール

- unit テストは `tests/unit/` 配下に、src のディレクトリ構造をミラーして配置すること。
  - 例: `src/domain/calculatePointDelta.ts` → `tests/unit/domain/calculatePointDelta.test.ts`
- integration テストは `tests/integration/` 配下に配置すること。
- e2e テストは `e2e/` 配下に配置すること。

## テスト実行コマンド

- 全テスト実行: `npx vitest run`
- unit テスト実行: `npx vitest run tests/unit`
- integration テスト実行: `npx vitest run tests/integration`
- ウォッチモード: `npx vitest`
