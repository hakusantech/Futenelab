---
title: "Next.js の基本 - モダンなReactフレームワークを学ぼう"
excerpt: "Next.jsの基本的な機能と使い方について解説します。ルーティング、データフェッチング、静的生成などの概念を理解しましょう。"
coverImage: "/assets/blog/nextjs-basics/cover.jpg"
date: "2023-06-15T12:00:00.000Z"
author:
  name: "Tech Blogger"
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/nextjs-basics/cover.jpg"
category: "frontend"
---

# Next.js の基本

Next.js は React のフレームワークで、サーバーサイドレンダリング（SSR）や静的サイト生成（SSG）などの機能を提供します。このフレームワークを使うことで、高速で SEO に強いウェブアプリケーションを構築できます。

## Next.js の主な特徴

Next.js には以下のような特徴があります：

1. **ファイルベースのルーティング**
2. **サーバーサイドレンダリング（SSR）**
3. **静的サイト生成（SSG）**
4. **API ルート**
5. **自動コード分割**

## ファイルベースのルーティング

Next.js では、`pages` ディレクトリ（App Router では `app` ディレクトリ）内のファイル構造に基づいてルーティングが自動的に設定されます。

例えば：

- `pages/index.js` → `/`
- `pages/about.js` → `/about`
- `pages/blog/[slug].js` → `/blog/:slug`

:::message
App Router では、`app` ディレクトリ内に `page.tsx` ファイルを配置することでルートが定義されます。
:::

## データフェッチング

Next.js では、以下のようなデータフェッチング方法が提供されています：

### getStaticProps

```js
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return {
    props: { data }, // ページコンポーネントにpropsとして渡される
  }
}
```

### getServerSideProps

```js
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return {
    props: { data }, // ページコンポーネントにpropsとして渡される
  }
}
```

## 静的サイト生成（SSG）

Next.js では、ビルド時にページを生成する静的サイト生成（SSG）がサポートされています。

```js
// pages/posts/[id].js
export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } }
    ],
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  const post = await res.json()

  return {
    props: { post }
  }
}
```

## まとめ

Next.js は React アプリケーションを構築するための強力なフレームワークです。ファイルベースのルーティング、サーバーサイドレンダリング、静的サイト生成などの機能により、高速で SEO に強いウェブアプリケーションを簡単に構築できます。

:::message alert
この記事は Next.js の基本的な機能のみを紹介しています。より詳細な情報は [Next.js の公式ドキュメント](https://nextjs.org/docs) を参照してください。
:::

## 参考リンク

@[card](https://nextjs.org/)
@[card](https://github.com/vercel/next.js)
