# Type Definition Rules

## 型の配置ルール

- domain 層の型（ビジネスエンティティ、値オブジェクト）は `src/domain/` 配下に定義すること。
- レイヤー間の契約型（repository インターフェース、adapter インターフェース）は `src/domain/` 配下に定義すること。infrastructure 層はこの契約に従って実装する。
- UI 専用型（props 型、表示用の変換型）は `src/ui/` 配下の対応するコンポーネントファイルまたは隣接ファイルに定義すること。domain 型と混在させない。

## union type と enum の使い分け

- 状態やカテゴリの列挙には union type（リテラル型の合併）を優先すること。
- enum は使用しない。TypeScript の union type で十分に表現可能であり、tree-shaking の観点でも優れる。

## any 禁止の補足

- `any` 型の使用は一切禁止する。
- 型が不明な場合は `unknown` を使用し、型ガードで絞り込むこと。
- 外部ライブラリの型定義が不十分な場合は、独自に型定義を作成すること。
- `as any` によるキャストも禁止する。

## 型名の命名規則

- 型名は PascalCase を使用すること。
- インターフェース名に `I` プレフィックスを付けない。
- Props 型は `{コンポーネント名}Props` とすること。
- domain 型はビジネス用語をそのまま使用すること（例: `MatchResult`, `BattleRecord`, `WinStreak`）。
