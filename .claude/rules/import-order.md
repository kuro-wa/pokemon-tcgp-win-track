# Import Order Rules

- domain 層は他レイヤーに依存してはならない（純粋なビジネスロジックのみ）。
- feature 層は domain 層にのみ依存してよい。
- UI 層は feature 層および domain 層に依存してよい。
- infrastructure 層は domain 層が定義する契約（型・インターフェース）に従って実装すること。
- 下位レイヤーから上位レイヤーへの import を禁止する。
  - 依存方向: domain ← feature ← UI / infrastructure → domain
- 循環依存を禁止する。モジュール間で相互 import が発生してはならない。
