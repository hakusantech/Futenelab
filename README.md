# Next.js テックブログ

Next.js と Markdown を使用した静的生成テックブログです。Tailwind CSS でスタイリングし、Zenn の独自記法にも対応しています。

## 特徴

- **Next.js App Router**: 最新の Next.js App Router を使用した高速なページ生成
- **Markdown サポート**: Markdown ファイルをビルド時に静的化して配信
- **Tailwind CSS**: ユーティリティファーストの CSS フレームワークで効率的かつ可読性の高い UI 実装
- **Zenn 記法対応**: zenn-markdown-html と zenn-content-css を使用して Zenn の独自記法をサポート
- **静的生成**: ビルド時に静的ページを生成し、高速なページ読み込みを実現
- **タイプセーフ**: TypeScript を使用した型安全な開発環境

## 使い方

### インストール

```bash
git clone <リポジトリURL>
cd tech-blog
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動し、[http://localhost:3000](http://localhost:3000) でブログにアクセスできます。

### ビルドと本番環境での実行

```bash
npm run build
npm run start
```

### 記事のピックアップ設定

記事をトップページのピックアップセクションに表示するには、記事のfrontmatterに`featured: true`を追加します。

```markdown
---
title: "記事のタイトル"
excerpt: "記事の抜粋"
coverImage: "/assets/blog/example/cover.jpg"
date: "2024-03-01T12:00:00.000Z"
author:
  name: "著者名"
  picture: "/assets/blog/authors/profile.jpg"
ogImage:
  url: "/assets/blog/example/cover.jpg"
category: "frontend"
featured: true
---
```

ピックアップ記事は以下のように表示されます：
- トップページの「ピックアップ」セクションに表示（最大3件）
- 最新記事セクションにも通常通り表示

ピックアップから外すには、`featured: true`を削除するか`featured: false`に設定します。

## 記事の作成と管理

### 記事の追加方法

1. `_posts` ディレクトリに新しい Markdown ファイルを作成します。
2. ファイル名は `slug.md` の形式にします（例: `my-first-post.md`）。
   - この `slug` はURLの一部になります（例: `/posts/my-first-post`）
3. ファイルの先頭に以下のようなフロントマターを追加します：

```markdown
---
title: "記事のタイトル"
excerpt: "記事の概要"
coverImage: "/assets/blog/my-first-post/cover.jpg"
date: "2023-05-01T12:00:00.000Z"
author:
  name: 著者名
  picture: "/assets/blog/authors/author.jpeg"
ogImage:
  url: "/assets/blog/my-first-post/cover.jpg"
---

ここに記事の内容を Markdown で書きます。
```

### フロントマターの詳細

フロントマターは記事のメタデータを定義する YAML 形式のブロックです。以下のフィールドが利用可能です：

| フィールド | 説明 | 必須 |
|------------|------|------|
| `title` | 記事のタイトル | ✅ |
| `excerpt` | 記事の概要（ホームページやカードに表示） | ✅ |
| `coverImage` | カバー画像のパス | ✅ |
| `date` | 公開日（ISO 8601形式） | ✅ |
| `author.name` | 著者名 | ✅ |
| `author.picture` | 著者のアバター画像のパス | ✅ |
| `ogImage.url` | OGP画像のURL（SNSでシェアされたときに表示される画像） | ✅ |

### 画像の追加方法

#### カバー画像の追加

1. `public/assets/blog/[記事のslug]/` ディレクトリを作成します（例: `public/assets/blog/my-first-post/`）
2. カバー画像を上記のディレクトリに `cover.jpg` という名前で配置します
3. フロントマターの `coverImage` に `/assets/blog/my-first-post/cover.jpg` のようにパスを指定します

#### 記事内の画像の追加

記事内に画像を追加するには、以下の2つの方法があります：

1. **Markdown標準の画像構文**:

```markdown
![代替テキスト](/assets/blog/my-first-post/image1.jpg)
```

2. **HTML/JSX構文（サイズ指定などが必要な場合）**:

```html
<div className="my-8">
  <img 
    src="/assets/blog/my-first-post/image1.jpg" 
    alt="代替テキスト" 
    className="mx-auto rounded-lg shadow-lg"
    width="600" 
    height="400" 
  />
  <p className="text-center text-sm text-gray-500 mt-2">画像のキャプション</p>
</div>
```

#### 画像のベストプラクティス

- **ファイル形式**: JPG, PNG, WebP, AVIF がサポートされています（WebPやAVIFは圧縮率が高いためおすすめ）
- **サイズ最適化**: 大きな画像はパフォーマンスに影響するため、適切なサイズに最適化してください
- **命名規則**: 画像ファイル名は英数字、ハイフン、アンダースコアのみを使用し、スペースは避けてください
- **構造化**: 各記事の画像は `/assets/blog/[記事のslug]/` ディレクトリに格納することを推奨します

### Markdown の基本記法

Markdownの基本的な記法は以下の通りです：

```markdown
# 見出し1
## 見出し2
### 見出し3

**太字** または __太字__
*イタリック* または _イタリック_
~~打ち消し線~~

- 箇条書き1
- 箇条書き2
  - ネストした箇条書き

1. 番号付きリスト1
2. 番号付きリスト2

[リンクテキスト](https://example.com)

> 引用文

水平線:
---

`インラインコード`

```言語名
コードブロック
```
```

## Zenn の独自記法

このブログでは以下の Zenn 独自記法が使用できます：

### メッセージボックス

```markdown
:::message
これは通常のメッセージです
:::

:::message alert
これは警告メッセージです
:::

:::message success
これは成功メッセージです
:::
```

表示例：
- 通常のメッセージ: 青色の背景で情報を表示
- 警告メッセージ: 赤色の背景で警告を表示
- 成功メッセージ: 緑色の背景で成功メッセージを表示

### アコーディオン（折りたたみ）

```markdown
:::details タイトル
ここに折りたたまれた内容が入ります。
詳細情報や補足説明などを記述できます。
:::
```

クリックすると展開される折りたたみコンテンツを作成できます。

### コードブロック（シンタックスハイライト付き）

```markdown
```js
function hello() {
  console.log("Hello, World!");
}
```

```python
def hello():
    print("Hello, World!")
```
```

多くのプログラミング言語に対応したシンタックスハイライトが適用されます。

### 数式表示

```markdown
$$
e^{i\pi} + 1 = 0
$$

インライン数式も使えます: $a^2 + b^2 = c^2$
```

LaTeX形式の数式を美しく表示できます。

### 外部コンテンツの埋め込み

```markdown
@[tweet](https://twitter.com/zenn_dev/status/1346731537488424960)

@[youtube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

@[card](https://github.com/zenn-dev/zenn-editor)
```

ツイート、YouTube動画、GitHubリポジトリなどを埋め込むことができます。

## 記事執筆のベストプラクティス

### SEO対策

- **タイトル**: 検索キーワードを含む、明確で魅力的なタイトルを設定する
- **メタ説明**: `excerpt` フィールドに検索結果に表示される魅力的な概要を書く
- **見出し構造**: 適切な見出しレベル（h1, h2, h3...）を使用して記事を構造化する
- **画像の代替テキスト**: すべての画像に適切な代替テキストを設定する

### 記事の構成

1. **導入部**: 記事の目的と読者が得られる価値を明確に説明
2. **本文**: 見出しで適切に区切られた、読みやすい段落構成
3. **コード例**: 実践的なコード例と説明
4. **まとめ**: 記事の要点をまとめ、次のステップや関連リソースを提案

### 記事の更新

既存の記事を更新する場合は、フロントマターの `date` フィールドを更新日時に変更することで、最新の記事として表示されるようになります。

## トラブルシューティング

### 画像が表示されない場合

1. パスが正しいか確認する（`/assets/...` で始まっているか）
2. 画像ファイルが `public` ディレクトリ内の正しい場所にあるか確認する
3. 画像ファイル名に特殊文字やスペースが含まれていないか確認する

### Zenn記法が正しく表示されない場合

1. 記法の前後に空行があるか確認する
2. コードブロックのバッククォートが正確に3つであるか確認する
3. メッセージボックスやアコーディオンのコロン（:::）が正確に3つであるか確認する

## ライセンス

MIT

## 謝辞

このプロジェクトは [Next.js blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) をベースに構築されています。

## 会社メンバー向け：記事の作成・更新ガイド

このセクションでは、Futene Tech Labブログの記事作成・更新方法について詳しく解説します。

### 記事作成の基本ステップ

1. **新規記事ファイルの作成**:
   - `_posts` ディレクトリに新しいMarkdownファイル（`.md`）を作成します
   - ファイル名は `記事のスラッグ.md` の形式にします（例: `web-design-tips.md`）
   - スラッグはURLの一部になるため、英数字とハイフンのみを使用し、日本語や特殊文字は避けてください

2. **フロントマターの設定**:
   ```markdown
   ---
   title: "記事のタイトル"
   excerpt: "記事の概要（検索結果やカードに表示される内容）"
   coverImage: "/assets/blog/web-design-tips/cover.jpg"
   date: "2023-05-01T12:00:00.000Z"
   author:
     name: "著者名"
     picture: "/assets/blog/authors/author.jpg"
   ogImage:
     url: "/assets/blog/web-design-tips/cover.jpg"
   category: "web-development"
   ---
   ```

   - `category`: 以下のいずれかを選択してください
     - `web-development`（Web開発）
     - `frontend`（フロントエンド）
     - `backend`（バックエンド）
     - `ai-ml`（AI・機械学習）
     - `devops`（DevOps）
     - `design`（デザイン）
     - `other`（その他）

3. **記事本文の作成**:
   - Markdown形式で記事を作成します
   - 見出しは階層構造を意識して、`#`（h1）、`##`（h2）、`###`（h3）を適切に使い分けてください
   - 最初の見出し（`# タイトル`）は自動的に生成されるため、本文では `##` から始めることを推奨します

### 画像の挿入方法

#### 1. 画像ファイルの配置

1. 記事用の画像ディレクトリを作成します:
   ```
   public/assets/blog/[記事のスラッグ]/
   ```
   例: `public/assets/blog/web-design-tips/`

2. 画像ファイルをこのディレクトリに配置します:
   - カバー画像: `cover.jpg`（必須）
   - 記事内画像: 分かりやすい名前を付けてください（例: `comparison.png`, `diagram.jpg`）

#### 2. 画像の最適化

- **ファイルサイズ**: 画像は圧縮して最適化してください（推奨: JPG/PNG は500KB以下、WebP は300KB以下）
- **解像度**: 幅1200px程度を推奨（大きすぎると読み込みが遅くなります）
- **フォーマット**:
  - 写真: JPG または WebP
  - 図表・スクリーンショット: PNG または WebP
  - アニメーション: GIF または WebP

#### 3. 記事内での画像参照

基本的な画像挿入:
```markdown
![代替テキスト](/assets/blog/web-design-tips/image1.jpg)
```

サイズ指定や中央揃えが必要な場合:
```markdown
<div className="my-8 flex justify-center">
  <img 
    src="/assets/blog/web-design-tips/image1.jpg" 
    alt="代替テキスト（SEOに重要）" 
    width="600" 
    height="400" 
    className="rounded-lg shadow-md"
  />
</div>
```

キャプション付き画像:
```markdown
<figure className="my-8">
  <img 
    src="/assets/blog/web-design-tips/image1.jpg" 
    alt="代替テキスト" 
    className="mx-auto rounded-lg shadow-md"
  />
  <figcaption className="text-center text-sm text-gray-500 mt-2">
    画像の説明文をここに入力
  </figcaption>
</figure>
```

### SEOを高めるためのコツ

#### 1. タイトルと概要の最適化

- **タイトル**:
  - 検索キーワードを含める（できれば前半部分に）
  - 40〜60文字程度の長さに収める
  - 具体的で魅力的な表現を使う（例: 「〜の方法」「〜のコツ」「〜完全ガイド」）
  - 数字を含めると効果的（例: 「7つの方法」「10のテクニック」）

- **概要（excerpt）**:
  - 120〜160文字程度で記事の内容を簡潔に要約
  - 主要なキーワードを自然に含める
  - 読者の興味を引く表現を使う
  - 記事の価値や解決する問題を明確に示す

#### 2. 記事構成のベストプラクティス

- **見出し（h2, h3）にキーワードを含める**:
  - 検索エンジンは見出しを重視します
  - 階層構造を適切に使用し、内容を整理する

- **冒頭部分の重要性**:
  - 最初の段落に主要なキーワードを自然に含める
  - 記事の目的と読者が得られる価値を明確に説明する

- **適切な段落分け**:
  - 1段落は3〜4文程度に収める
  - 読みやすさを重視し、長文は避ける

- **リストや表の活用**:
  - 情報を整理して読みやすくする
  - スキャンしやすい形式で提供する

#### 3. 画像のSEO対策

- **ファイル名の最適化**:
  - キーワードを含めた意味のあるファイル名を使用（例: `responsive-design-example.jpg`）
  - スペースの代わりにハイフンを使用

- **代替テキスト（alt属性）の充実**:
  - すべての画像に適切な代替テキストを設定
  - 画像の内容を具体的に説明し、可能であればキーワードを含める
  - 装飾的な画像の場合は空の alt 属性（`alt=""`）を使用

#### 4. 内部リンクの活用

- 関連する他の記事へのリンクを適切に配置
- アンカーテキストにはリンク先の内容を示す具体的な言葉を使用
- 例:
  ```markdown
  詳細については[レスポンシブデザインの基本原則](/posts/responsive-design-basics)を参照してください。
  ```

#### 5. 更新日の管理

- 記事の内容を更新した場合は、フロントマターの `date` も更新してください
- 更新頻度の高いコンテンツは検索エンジンから評価されます

### Zenn記法を活用した読みやすい記事作成

#### コードブロック

```markdown
```js
// JavaScriptのコード例
function example() {
  console.log("Hello, World!");
}
```
```

#### メッセージボックス

```markdown
:::message
これは通常のメッセージです。補足情報などに使用します。
:::

:::message alert
これは警告メッセージです。注意点や警告に使用します。
:::

:::message success
これは成功メッセージです。ポイントや重要な情報に使用します。
:::
```

#### アコーディオン（折りたたみ）

```markdown
:::details 詳細情報を見る
ここに折りたたまれた内容が入ります。
長い補足説明やコード例などを入れるのに適しています。
:::
```

### 記事公開前のチェックリスト

- [ ] タイトルと概要（excerpt）は魅力的で検索キーワードを含んでいるか
- [ ] カバー画像は適切に設定されているか
- [ ] カテゴリは適切に選択されているか
- [ ] 見出し構造は適切か（h1 → h2 → h3 の順序）
- [ ] 画像の代替テキストは適切に設定されているか
- [ ] 内部リンクは適切に配置されているか
- [ ] 誤字脱字や文法ミスがないか
- [ ] コードブロックは正しく表示されるか
- [ ] モバイル表示でも読みやすいか

### 記事の更新方法

既存の記事を更新する場合:

1. `_posts` ディレクトリ内の該当するMarkdownファイルを編集
2. フロントマターの `date` を更新日時に変更
3. 変更内容をコミットしてプッシュ

### トラブルシューティング

- **画像が表示されない場合**:
  - パスが正しいか確認（`/assets/blog/...` で始まっているか）
  - 画像ファイルが実際に指定した場所に存在するか確認
  - ファイル名の大文字小文字が一致しているか確認

- **Markdown記法が正しく表示されない場合**:
  - 空白行の有無を確認（見出しの前後には空白行が必要）
  - コードブロックの記法を確認（バッククォートが正しく閉じられているか）

- **ビルドエラーが発生する場合**:
  - フロントマターの形式が正しいか確認
  - 必須フィールドがすべて入力されているか確認

### 参考リソース

- [効果的なSEOタイトルの書き方](https://moz.com/learn/seo/title-tag)
- [画像最適化ツール](https://squoosh.app/)
- [Markdownガイド](https://www.markdownguide.org/)
- [Zenn記法の詳細](https://zenn.dev/zenn/articles/markdown-guide)
