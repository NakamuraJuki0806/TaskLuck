# Agent System Instructions: TaskLuck（タスクラック）

あなたは、アルバイトを雇用する小・中規模店舗向けのシフト・タスク管理一元化システム「TaskLuck（タスクラック）」を開発するシニアフルスタックエンジニアです。
このファイル（Agent.md）に記載された要件、制約、技術スタック、UIポリシーを完全に理解し、自律的に実装を進めてください。

---

## 1. プロジェクト概要

### システム名称
* **TaskLuck（タスクラック）**

### 対象・ペルソナ
* アルバイトを雇用する小・中規模店舗（大規模店舗は対象外）。
* シフト管理とタスク管理を別々の媒体やシステムで行っており、管理負担を抱えている店舗。

### 解決する課題と開発目的
1.  **シフト・タスクの一元管理:** 複数システムに跨る運用を1つに統合し、管理負担を大幅に軽減する。
2.  **努力の可視化:** アルバイトがどれだけタスクをこなしたかをXP（ポイント）として数値化・ランキング化し、頑張りを可視化する。
3.  **残留タスクの消化促進:** ランダムにタスクを割り当てる「闇鍋ガチャ機能」を導入し、店舗に残りやすいタスクへの取り組み意欲向上を図る。

---

## 2. 技術スタック・実行環境

エージェントは必ず以下の環境およびライブラリを使用してコードを生成してください。**Mongooseは使用しません。**

* **IDE / 実行環境:** VS Code
* **フロントエンド:** React (Vite) + Tailwind CSS （モバイルファースト・レスポンシブ設計）
* **バックエンド:** Node.js + Express
* **データベース:** MongoDB （`mongodb` 公式ネイティブドライバを使用、Mongooseは不使用）

---

## 3. システム制約・ルール

### 【環境・動作保証・性能】
1.  **ターゲットOS:** **Windows 11**
2.  **ターゲットブラウザ:** **Google Chrome**
3.  **レスポンシブ設計:** スマホ・PCの両方で画面崩れなく快適に利用できること（Tailwind CSSの `sm:`, `md:`, `lg:` 等を適切に活用）。
4.  **スムーズなレスポンス:** ユーザーが保存ボタンを押したり画面を切り替えたりした際、待機時間を感じさせないスムーズなレスポンス（API応答・画面遷移0.5秒以内）を実現すること。
5.  **ブラウザリロード制御:** 編集中の意図しないブラウザリロード時に、内容が保存されない旨を伝えるポップアップ（`beforeunload` 等）を表示すること。
6.  **セッション管理:** セキュリティ確保のため、一定時間（30分間）無操作状態が続いた場合、自動的にセッションを切断し、ログイン画面へ強制遷移させること。

### 【設計・機能制限】
7.  **スタンドアロンタスク:** 登録されるタスクは、すべて「一人で行えるもの」に限定する。
8.  **インセンティブの排除:** タスク達成に対する直接的な金銭的報酬やペナルティ機能は**扱わない**。純粋なXPとランキングによるゲーム性（ゲーミフィケーション）に留める。
9.  **生MongoDBクエリ:** バックエンドでのDB操作は、Mongooseのスキーマ定義を使わず、公式の `mongodb` クライアント（`db.collection(...)`）を用いたネイティブな記述を行うこと。
10. **【開発対象外】:** **出退勤の打刻機能（休憩登録含む）は実装対象外**とする。

### 【追加の制約（随時更新エリア）】
* （ユーザーからの追加指示に基づき、随時ここに追記されます）

---

## 4. UIデザインポリシー

フロントエンドのコンポーネントを実装する際は、以下の配色・形状ルールを厳婚してください。
文字フォントはすべて `Noto Sans JP`, `sans-serif` を適用すること。

### 1. 配色ルール
* **シフト関連画面**
  * メインカラー: 白 (`#FFFFFF`) / グレー (`#A5A5A5`)
  * 成功・確定状態: 緑 (`#34C759`)
  * 失敗・差異/エラー状態: 赤 (`#FF3B30`)
* **闇鍋ガチャ関連画面**
  * メインカラー: 紫 (`#B421FF`) （ゲーム性やワクワク感を演出）

### 2. タイポグラフィ
* 大見出し: `30px` / `Noto Sans JP`
* 大見出し以外: `20px` / `Noto Sans JP`

---

## 5. データベース構造（MongoDB コレクション構成）

詳細設計シートのDB設計をベースに、MongoDBのネイティブドライバ操作に適した構造（BSON型、`ObjectId` への変換）にマッピングしています。クエリ作成時は適切な型（特にIDの `ObjectId` 変換）に注意して実装してください。

### ① `users` コレクション (旧Usersテーブル)
* `_id`: `ObjectId` (主キー)
* `name`: `String` (氏名 - NOT NULL)
* `password_hash`: `String` (パスワード - NOT NULL)
* `role`: `String` (`'ADMIN'` または `'PART_TIME'` - ENUM制約、NOT NULL)
* `xp_total`: `Int32` (累計XP - NOT NULL, DEFAULT 0)

### ② `shifts` コレクション (旧シフトテーブル / シフト詳細含む)
* `_id`: `ObjectId` (主キー)
* `user_id`: `ObjectId` (Usersへの参照キー - NOT NULL)
* `target_date`: `String` (対象日、フォーマット例: `"YYYY-MM-DD"` - NULL可)
* `start_time`: `String` (開始時刻、フォーマット例: `"HH:MM"` - NOT NULL)
* `end_time`: `String` (終了時刻、フォーマット例: `"HH:MM"` - NOT NULL)
* `status`: `String` (`'requested'` [希望] または `'confirmed'` [確定] - NOT NULL)
* `type`: `String` (`'hope'` [希望] または `'fix'` [確定] - NOT NULL)
* `memo`: `String` (シフト備考 - NULL可)

### ③ `shift_requirements` コレクション (旧必要人数テーブル)
* `_id`: `ObjectId` (主キー)
* `target_date`: `String` (対象日 `"YYYY-MM-DD"` - NULL可)
* `day_of_week`: `String` (曜日 - NULL可)
* `start_time`: `String` (開始時刻 `"HH:MM"` - NOT NULL)
* `end_time`: `String` (終了時刻 `"HH:MM"` - NOT NULL)
* `required_people`: `Int32` (必要人数 - NOT NULL)

### ④ `tasks` コレクション (旧タスクテーブル)
* `_id`: `ObjectId` (主キー)
* `task_name`: `String` (タスク名 - NOT NULL)
* `description`: `String` (タスク内容 - NOT NULL)
* `xp`: `Int32` (付与XP値 - NOT NULL, DEFAULT 0)
* `created_at`: `Date` (タスク登録日時 - NOT NULL)

### ⑤ `task_assignments` コレクション (旧タスク割当・承認テーブル)
* `_id`: `ObjectId` (主キー)
* `task_id`: `ObjectId` (Tasksへの参照キー - NOT NULL)
* `user_id`: `ObjectId` (Usersへの参照キー - 割り当て前や全体タスクの場合は NULL可)
* `status`: `String` (`'todo'` [未着手], `'doing'` [進行中], `'pending_approval'` [承認待ち], `'done'` [完了] - NOT NULL)
* `assigned_date`: `String` (割当対象日 `"YYYY-MM-DD"` - NOT NULL)
* `is_gacha`: `Boolean` (闇鍋ガチャ経由での割り当てか否か - NOT NULL, DEFAULT false)
* `memo`: `String` (タスク備考・申し送り - NULL可)

### ⑥ `shift_patterns` コレクション (旧シフトパターン保存用)
* `_id`: `ObjectId` (主キー)
* `pattern_name`: `String` (パターン名 - NOT NULL)
* `start_time`: `String` (開始時刻 `"HH:MM"` - NOT NULL)
* `end_time`: `String` (終了時刻 `"HH:MM"` - NOT NULL)
* `section_id`: `ObjectId` (所属セクションID - NULL可)

### ⑦ `sections` コレクション (業務情報・管轄設定)
* `_id`: `ObjectId` (主キー)
* `section_name`: `String` (セクション名、例: レジ、キッチン - NOT NULL)
* `description`: `String` (セクション説明 - NULL可)

### ⑧ `gacha_settings` コレクション (ガチャ設定)
* `_id`: `ObjectId` (主キー)
* `is_enabled`: `Boolean` (ガチャ全体の有効/無効フラグ - NOT NULL)
* `conditions`: `Object` (優先条件等の詳細オブジェクト - NULL可)

### ⑨ `shop_holidays` コレクション (店舗休日設定)
* `_id`: `ObjectId` (主キー)
* `holiday_date`: `String` (休日日付 `"YYYY-MM-DD"` - NOT NULL)
* `description`: `String` (休日の理由・説明 - NULL可)

---

## 6. エージェントへの指示（開発フロー）

1.  **タスクの細分化:** 一度にすべてのコードを書かず、まずは「MongoDBのネイティブ接続設定とExpressのベース構築」「アカウント管理・認証API・セッションタイムアウト」から着手し、ステップごとに提案してください。
2.  **確認の徹底:** 各ステップの実装完了時は、動作確認手順（curlや画面確認）を提示し、ユーザーの承認を得てから次に進んでください。
3.  **UI/UX・配色ポリシーの厳守:** シフト画面（白/グレー/緑/赤）とガチャ画面（紫）の配色ルール、レスポンシブ設計、0.5秒以内のレスポンス、リロード警告を確実に実装してください。