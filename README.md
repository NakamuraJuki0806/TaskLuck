# S-T_MS

React (Vite + Tailwind CSS) のフロントエンドと、Node.js + Express + MongoDB のバックエンドを分けた開発用モノレポです。

## 構成

- `client`: React + Vite + Tailwind CSS
- `server`: Node.js + Express + MongoDB

## 事前準備

1. Node.js 18 以上を入れる
2. ローカル MongoDB を起動する、または接続先 URI を用意する
3. `.env.example` を参考に `.env` を作る

## セットアップ

```bash
npm install
```

## 開発起動

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:5000/health

## 個別起動

```bash
npm run dev:client
npm run dev:server
```

## API

- `GET /health`: 動作確認用エンドポイント

## 環境変数

- `MONGODB_URI`: MongoDB 接続文字列
- `PORT`: バックエンドの待受ポート
- `VITE_API_URL`: フロントエンドから参照する API の URL# S-T_MS