---
name: write-repository
description: データアクセス層やリポジトリ処理の実装・修正時に使用する。UIや単純なロジック変更には使用しない。
---
# Repository Skill

## トリガー条件

以下の依頼時にこの skill を適用する:
- データの保存・取得・削除処理の実装
- 永続化操作の CRUD インターフェース実装
- repository パターンによるデータアクセス層の構築

## TDD 前提条件

- この skill を実行する前に、対象機能のテストを先に作成済みであること。
- テスト未作成の場合は、先に write-tests skill を適用すること。

## 実装ルール

- データの保存・取得・削除など永続化操作の責務に限定すること。
- `src/infrastructure/` 配下に配置すること。
- domain 層が定義する型・インターフェースに従って実装すること。
- テスト時にモック・スタブへ差し替え可能な設計にすること。

## write-infrastructure skill との責務分担

- write-repository: 保存・取得・削除などの永続化操作（CRUD）を担当する。
- write-infrastructure: serialize/deserialize、adapter、外部API連携など、永続化操作以外のインフラ関心事を担当する。
