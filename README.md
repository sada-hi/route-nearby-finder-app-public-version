# route-nearby-finder-app-public-version

ルート周辺検索マップ - Google Maps APIを活用したルート周辺の経由地検索アプリ

## 概要

出発地と目的地を入力し、「ラーメン」「コンビニ」「電気屋」など自由なキーワードでルート上またはルート付近にある経由地を検索できる地図アプリです。検索結果のプロットを選択すると、その地点を経由した新しいルートを再計算し、元のルートとの差分時間・距離・到着予想時刻を表示します。また、経由地候補は検索結果リストでユーザが選択した距離順・時間順・評価順のどれかで昇順にソートされて表示されます。

## 主な機能

- ルート生成（Google Directions API）
- ルート周辺の店舗・施設検索（Google Places API）
- 経由地を含む新ルートの計算
- 差分情報の表示（追加距離・追加時間・到着予想時刻）
- 検索結果の並べ替え（距離順・時間順・評価順）
- レスポンシブデザイン対応

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS
- **バックエンド**: Node.js + Express + TypeScript
- **外部API**: Google Maps (Directions API / Places API / Geocoding API)
- **アイコン**: Lucide React

## セットアップ

### 1. 環境変数の設定

`.env`ファイルに以下の環境変数を設定してください：

\`\`\`
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
\`\`\`

Google Maps APIキーの取得方法:
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成または選択
3. 以下のAPIを有効化:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
4. 認証情報からAPIキーを作成

### 2. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 3. アプリケーションの起動

#### フロントエンド（開発サーバー）

\`\`\`bash
npm run dev
\`\`\`

ブラウザで `http://localhost:5173` にアクセス

#### バックエンド（APIサーバー）

別のターミナルで以下を実行：

\`\`\`bash
npm run server
\`\`\`

APIサーバーは `http://localhost:3001` で起動します

## 使い方

1. **出発地を入力**: 住所または緯度・経度を入力（「現在地を使用」ボタンで位置情報も取得可能）
2. **目的地を入力**: 住所または緯度・経度を入力
3. **検索ワードを入力**: 例: 「ラーメン」「コンビニ」「カフェ」
4. **検索範囲を調整**: スライダーで100m〜3000mの範囲を設定
5. **検索ボタンをクリック**: ルートと周辺店舗が地図上に表示されます
6. **店舗を選択**: リストまたは地図上のピンをクリックすると経由ルートを表示
7. **差分情報を確認**: 追加距離・追加時間・到着予想時刻を確認

## API エンドポイント

### GET /api/route
出発地と目的地から基本ルートを取得

**パラメータ:**
- `start`: 出発地（住所または緯度,経度）
- `end`: 目的地（住所または緯度,経度）

### GET /api/places
指定ルート上でキーワードに一致する店舗を取得

**パラメータ:**
- `polyline`: ルートのポリライン（エンコード済み）
- `keyword`: 検索キーワード
- `range`: 検索範囲（メートル）

### GET /api/reroute
経由地を含む新ルートを取得・差分を計算

**パラメータ:**
- `start`: 出発地
- `end`: 目的地
- `waypoint`: 経由地（緯度,経度）
- `originalDistance`: 元の距離（メートル）
- `originalDuration`: 元の時間（秒）

## プロジェクト構成

\`\`\`
project/
├── server/                 # バックエンド
│   ├── index.ts           # Expressサーバー
│   ├── routes/            # APIルート
│   │   ├── route.ts       # ルート取得
│   │   ├── places.ts      # 店舗検索
│   │   └── reroute.ts     # 経由ルート計算
│   └── utils/             # ユーティリティ
│       └── geometry.ts    # 地理計算関数
├── src/                   # フロントエンド
│   ├── components/        # Reactコンポーネント
│   │   ├── SearchForm.tsx # 検索フォーム
│   │   ├── MapDisplay.tsx # 地図表示
│   │   ├── PlacesList.tsx # 店舗リスト
│   │   └── RouteInfo.tsx  # ルート情報
│   ├── services/          # APIクライアント
│   │   └── api.ts
│   ├── types/             # TypeScript型定義
│   │   └── index.ts
│   └── App.tsx            # メインアプリ
└── .env                   # 環境変数
\`\`\`

## 実行画面
###全体画面
![アプリ画面①](https://github.com/sada-hi/route-nearby-finder-app-public-version/blob/main/images/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202026-03-11%20002559.png)

## 今後の拡張予定

- 検索履歴保存
- お気に入り登録
- 人気の立ち寄りスポット提案
- 営業時間・混雑状況表示
- 複数経由地対応
- 複数キーワード同時検索

## ライセンス

MIT
