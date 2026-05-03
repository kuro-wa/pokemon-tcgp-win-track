# AGENTS.md

## Project Overview

ポケモン TCGP（Trading Card Game Pocket）の対戦成績を記録・追跡するWebアプリケーション。
勝敗記録、連勝数、ポイント計算、および遷移グラフの可視化を行う。

---

## Tech Stack

* Language: TypeScript
* UI: React
* Build Tool: Vite
* Testing: Vitest
* Persistence: LocalStorage

---

## Commands

* install: `npm install`
* dev: `npm run dev`
* build: `npm run build`
* test (all): `npx vitest run`
* test (unit): `npx vitest run tests/unit`
* test (integration): `npx vitest run tests/integration`
* test (watch): `npx vitest`

---

## Directory Structure

```
src/
├── domain/          # 型定義・計算ロジック・ビジネスルール
├── feature/         # カスタムフック・状態管理
├── ui/              # Reactコンポーネント
└── infrastructure/  # LocalStorage・adapter・serialize/deserialize

tests/
├── unit/            # 単体テスト（src構造をミラー）
└── integration/     # 結合テスト

e2e/                 # E2Eテスト
```

---

## Working Rules

* 変更は局所化し、既存構造（domain / feature / ui / infrastructure）を維持する。
* ビジネスロジックは `domain` に配置し、UIに直接書かない。
* 状態管理ロジックは `feature` に集約する。
* 永続化処理は `infrastructure` に限定する。
* UI変更時は表示崩れ・状態同期・グラフ表示を確認する。
* LocalStorage構造を変更する場合は既存データとの互換性を考慮する。

---

## Testing Rules

* 実装前にテストを作成する（TDD）。
* テスト未作成の機能は実装しない。
* 単体テストは domain / feature のロジックを対象とする。
* integration テストでは状態管理と永続化の連携を検証する。
* 変更時は関連テストを必ず実行する。

---

## Do Not

* 不要な大規模リファクタを行わない。
* UI構造を根本から変更しない。
* domainロジックをUI層に書かない。
* 永続化ロジックを分散させない。
* テストなしで実装を追加しない。

---

## Skills

プロジェクトにはタスク別の skills が存在する。
対応する作業時に適切な skill を使用すること。

---

## Notes

* 現在はローカル環境で開発中（GitHub未作成）。
* Codexは本ファイルを基準に作業を行う。
