# Infrastructure Skill

## トリガー条件

以下の依頼時にこの skill を適用する:
- serialize / deserialize 処理の実装
- 外部 API との通信 adapter の実装
- ブラウザ API（LocalStorage 等）のラッパー実装
- データ変換・フォーマット変換の adapter 実装

## TDD 前提条件

- この skill を実行する前に、対象機能のテストを先に作成済みであること。
- テスト未作成の場合は、先に write-tests skill を適用すること。

## 実装ルール

- 外部依存（LocalStorage・ブラウザ API・外部 API など）を隔離する責務を持つこと。
- LocalStorage やブラウザ API への直接アクセスを UI 層・feature 層に記述してはならない。
- serialize / deserialize の責務を明確に分離すること。変換ロジックを呼び出し元に漏らさない。
- 破損データや未定義データに対して安全なフォールバックを実装すること。
- テスト時にモック・スタブへ差し替え可能な設計にすること。
- `src/infrastructure/` 配下に配置すること。

## write-repository skill との責務分担

- write-infrastructure: serialize/deserialize、adapter、外部API連携、ブラウザAPIラッパーなど、永続化操作以外のインフラ関心事を担当する。
- write-repository: 保存・取得・削除などの永続化操作（CRUD）を担当する。
