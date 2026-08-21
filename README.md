# わが家の家計バランス診断（Netlify版）

このリポジトリは、Netlifyで配信するための**静的サイト版**です。React、WordPress、データベース、サーバーサイド処理には依存しません。収入入力に対する計算は、閲覧者のブラウザ内のVanilla JavaScriptだけで完結します。

| 項目 | 内容 |
| --- | --- |
| マークアップ | HTML5 |
| スタイル | SCSS（ビルド時に圧縮CSSへ変換） |
| 挙動 | Vanilla JavaScript |
| ホスティング | Netlify Static Site |
| 画像 | ビルド前にWebPへ圧縮済み |

## ローカルビルド

```bash
npm install
npm run prepare:deploy
```

ビルド後の公開対象は `dist/` です。ローカルで確認する場合は、`dist/` を静的HTTPサーバーで開いてください。

## Netlify設定

NetlifyではGitHubリポジトリを選択して、以下の値を設定してください。`netlify.toml` が存在するため、通常は自動検出されます。

| 設定 | 値 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node.js | `20` |

## 画像の取り扱い

元画像はリポジトリに含めず、`scripts/compress_images.py` が承認済みの画像を `src/assets/images/` にWebPとして生成します。更新時は元画像を指定のソースに置き、次の順で実行してください。

```bash
npm run compress:images
npm run build
```
