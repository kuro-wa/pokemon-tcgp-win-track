# Architecture Separation Rules

- UI（React）にビジネスロジックを記述してはならない。
- 計算処理は domain 層に実装すること。
- 状態管理は feature 層に集約すること。
- インフラ依存（LocalStorageなど）は infrastructure 層に隔離すること。
