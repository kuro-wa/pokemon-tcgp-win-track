# PokemonTcgpWinTrack

## プロジェクト概要

ポケモン TCGP（Trading Card Game Pocket）の対戦成績を記録・追跡するWebアプリケーション。
勝敗記録、連勝数、ポイント計算などの戦績管理機能を提供する。

## 技術スタック

- **言語**: TypeScript
- **UI**: React
- **ビルドツール**: Vite
- **テスト**: Vitest
- **永続化**: LocalStorage

## パッケージマネージャ

npm

## コマンド

| 用途 | コマンド |
|------|---------|
| 依存インストール | `npm install` |
| 開発サーバー起動 | `npm run dev` |
| ビルド | `npm run build` |
| 全テスト実行 | `npx vitest run` |
| unit テスト | `npx vitest run tests/unit` |
| integration テスト | `npx vitest run tests/integration` |
| テスト（ウォッチ） | `npx vitest` |

## ディレクトリ構成

```
src/
├── domain/          # 型定義、計算ロジック、ビジネスルール
├── feature/         # カスタムフック、状態管理
├── ui/              # React コンポーネント
└── infrastructure/  # LocalStorage、adapter、serialize/deserialize
tests/
├── unit/            # 単体テスト（src構造をミラー）
└── integration/     # 結合テスト
e2e/                 # E2Eテスト
```

## 開発ルールと skill

- `.claude/rules/` 配下に実装時のルールを定義している。全ルールに従うこと。
- `.claude/skills/` 配下に実装タスク別の skill を定義している。対応する作業時に適用すること。
- **TDD 必須**: 実装前に必ずテストを作成すること。テスト未作成の機能は実装してはならない。
