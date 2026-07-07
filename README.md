# とおまち 夏花火ナイト LP

## ファイル構成

```
toomachi-hanabi-lp/
├── index.html      ← メインHTML
├── style.css       ← スタイルシート
├── script.js       ← JavaScript（FAQ・フォーム・アニメーション）
├── gas.js          ← Google Apps Script（フォーム→スプレッドシート連携）
├── img/            ← 画像・動画フォルダ（下記参照）
│   ├── fv-poster.jpg        ← FV動画のポスター画像
│   ├── fv.mp4               ← FV背景動画（Veo3生成）
│   ├── story-arrive.mp4     ← 来場ストーリー：到着シーン（Veo3）
│   ├── story-shopping.jpg   ← 来場ストーリー：商店街
│   ├── story-food.jpg       ← 来場ストーリー：食べ歩き
│   ├── story-hanabi.mp4     ← 来場ストーリー：花火シーン（Veo3）
│   ├── story-stay.jpg       ← 来場ストーリー：宿泊
│   ├── hanabi-main.jpg      ← 花火メインカット
│   ├── stay-ryokan.jpg      ← 旅館 川の音
│   ├── stay-minshuku.jpg    ← 民宿 やまぐち
│   ├── stay-hotel.jpg       ← ホテル とおまちステーション
│   ├── food-maruya.jpg      ← 食堂まるや
│   ├── food-kappo.jpg       ← 割烹とおまち
│   ├── food-unagi.jpg       ← うなぎ川長
│   ├── food-bistro.jpg      ← ビストロ灯台
│   ├── food-coffee.jpg      ← 珈琲あかつき
│   └── food-bar.jpg         ← CAFÉ & BAR 縁
└── README.md
```

## セットアップ手順

### 1. 画像・動画の準備
`img/` フォルダを作成して、上記ファイルを配置してください。
- 動画（.mp4）：Veo3で生成
- 写真（.jpg）：Leonardo AI / 素材サイト等

### 2. GAS連携セットアップ
1. Google スプレッドシートを新規作成してIDをメモ
2. Apps Script エディタを開き `gas.js` の内容をペースト
3. `SHEET_ID` を自分のスプレッドシートIDに書き換え
4. デプロイ → ウェブアプリ → アクセス：全員
5. デプロイURLを `script.js` の `GAS_URL` に貼り付け

### 3. キャラクター画像の差し込み
キャラクターが決まったら：
- `.chara-placeholder` / `.chara-placeholder--sm` を `<img>` タグに置き換え
- FV用（100×120px）とインライン用（48×56px）の2サイズ用意

### 4. GitHub Pagesデプロイ
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/kiebu119/toomachi-hanabi-lp.git
git push -u origin main
```
GitHub → Settings → Pages → Source: main branch → Save

## カラーパレット
| 名称 | カラーコード |
|------|------------|
| Primary Navy | #1B2A4A |
| Secondary Cream | #FFF6E5 |
| Accent Orange | #E8633C |
| Text | #333333 |
| Muted | #888888 |
| Border | #D4C9BC |

## フォント
- 見出し：Shippori Mincho（Google Fonts）
- 本文：Noto Sans JP（Google Fonts）
