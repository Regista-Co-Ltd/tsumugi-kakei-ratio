# Netlify移行：引き継ぎ用メモ

以下をそのまま次の作業者へ共有できます。

---

この案件は、`Regista-Co-Ltd/kakei-golden-ratio` の静的サイトです。WordPress、React、DB、APIは不要です。HTML・Vanilla JavaScript・SCSSで構成され、Netlifyで `dist/` を配信します。

## 初回セットアップ

```bash
git clone https://github.com/Regista-Co-Ltd/kakei-golden-ratio.git
cd kakei-golden-ratio
npm install
npm run prepare:deploy
```

`prepare:deploy` は、画像をWebPへ圧縮してからSCSSを圧縮CSSへ変換し、`dist/` に配信用ファイルを生成します。生成物の `dist/` と `node_modules/` はGit管理しません。

## Netlifyでの初回設定

1. Netlifyで **Add new site** → **Import an existing project** を選びます。
2. GitHubを選び、`Regista-Co-Ltd/kakei-golden-ratio` を指定します。
3. Production branch は `main`、Build command は `npm run build`、Publish directory は `dist` を設定します。
4. Deploy site を実行します。以降、`main` ブランチへのpushで自動デプロイされます。

`netlify.toml` に同じ設定を保存済みです。Netlifyの画面で自動検出されない場合だけ、上記の値を手入力してください。

## ソース構成

| パス | 用途 |
| --- | --- |
| `src/index.html` | ページ構造とコンテンツ |
| `src/js/app.js` | 家計シミュレーション（Vanilla JS） |
| `src/scss/main.scss` | デザインのソースSCSS |
| `src/assets/images/` | 圧縮済みWebP画像 |
| `scripts/compress_images.py` | 画像圧縮スクリプト |
| `netlify.toml` | Netlifyのビルド・キャッシュ設定 |

## 変更時の注意

- 家計比率は `src/js/app.js` の `rules` 配列で管理しています。合計は必ず100%にしてください。
- デザインは「暮らしのノート」が方針です。生成り、セージ、アプリコットコーラル、罫線、マージン線、紙片の表現を維持してください。
- 新しい画像を追加する場合は、原則としてWebPに圧縮してから `src/assets/images/` に置いてください。大きすぎる画像はNetlifyの無料枠と表示速度の両方に影響します。
- プラグイン配布ページ・WordPress用コードはこの静的サイト移行後は不要です。必要になった場合は、別リポジトリで管理してください。

---

以上です。Netlifyの初回接続・ドメイン設定など、アカウント操作を伴う処理はサイト所有者側で実施してください。
