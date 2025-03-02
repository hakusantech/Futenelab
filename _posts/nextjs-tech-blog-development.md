---
title: "CursorでNext.jsベースの技術ブログを爆速開発した話"
excerpt: "Next.js、TypeScript、Tailwind CSSを使用して、高機能な技術ブログを短期間で開発した経験を共有します。数式表示やZenn記法対応など、エンジニアに必要な機能を全て実装しました。"
coverImage: "/assets/blog/nextjs-tech-blog-development/cover.jpg"
date: "2024-03-02T12:00:00.000Z"
author:
  name: "Tech Blogger"
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/nextjs-tech-blog-development/cover.jpg"
category: "web-development"
featured: true
---

## はじめに

技術ブログの立ち上げは、多くのスタートアップや技術者にとって重要なタスクです。しかし、高品質なブログを一から構築するのは、想像以上に時間と労力がかかるものです。この記事では、Next.js、TypeScript、Tailwind CSSを使用して、数式表示やZenn記法対応など、エンジニアに必要な機能を全て備えた技術ブログを爆速で開発した経験を共有します。

## 技術スタックの選定

### フレームワークとライブラリ

- **Next.js**: App Routerを採用し、最新のReactアーキテクチャを活用
- **TypeScript**: 型安全性を確保し、開発効率を向上
- **Tailwind CSS**: ユーティリティファーストで効率的なスタイリング
- **KaTeX**: 数式表示のための数学表記エンジン
- **zenn-markdown-html**: Zennの独自記法をサポート

### なぜこの構成を選んだのか

1. **Next.jsの採用理由**
   - 静的サイト生成（SSG）による高速なページ読み込み
   - App Routerによる直感的なルーティング
   - TypeScriptのネイティブサポート
   - 優れたSEO対応

2. **Tailwind CSSの採用理由**
   - コンポーネントベースの開発との相性の良さ
   - ユーティリティクラスによる高速な開発
   - カスタマイズ性の高さ

## 主要機能の実装

### 1. 記事管理システム

Markdownベースの記事管理システムを実装しました。各記事は以下の構造を持ちます：

```typescript
type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  category?: string;
  featured?: boolean;
};
```

### 2. カテゴリシステム

記事を整理するためのカテゴリシステムを実装：

```typescript
const CATEGORIES = [
  { id: 'web-development', name: 'Web開発' },
  { id: 'frontend', name: 'フロントエンド' },
  { id: 'backend', name: 'バックエンド' },
  { id: 'ai-ml', name: 'AI・機械学習' },
  { id: 'devops', name: 'DevOps' },
  { id: 'design', name: 'デザイン' },
  { id: 'other', name: 'その他' },
];
```

### 3. 数式表示機能

KaTeXを使用して、数式表示機能を実装しました：

```typescript
useEffect(() => {
  const renderMathInElement = () => {
    const element = contentRef.current;
    if (!element) return;

    // 数式を含む要素を検索して処理
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE) {
        const text = el.textContent || '';
        
        // ブロック数式とインライン数式の処理
        if (text.trim().startsWith('$$') && text.trim().endsWith('$$')) {
          // ブロック数式の処理
          const formula = text.trim().slice(2, -2).trim();
          try {
            el.innerHTML = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false
            });
            el.className += ' katex-block';
          } catch (error) {
            console.error("KaTeX error:", error);
          }
        }
        // インライン数式の処理も同様に実装
      }
    });
  };

  renderMathInElement();
}, [content]);
```

### 4. ピックアップ記事システム

トップページに特定の記事を強調表示するためのピックアップシステムを実装：

```typescript
const allPosts = getAllPosts();
  
// ピックアップ記事（featured: trueの記事を取得）
const pickupPosts = allPosts.filter(post => post.featured).slice(0, 3);

// 最新記事（ピックアップ記事との重複を許可）
const latestPosts = allPosts.slice(0, 6);
```

## UI/UXの最適化

### 1. レスポンシブデザイン

Tailwind CSSを活用して、全ての画面サイズに対応したレスポンシブデザインを実装：

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {posts.map((post) => (
    <ArticleCard
      key={post.slug}
      title={post.title}
      coverImage={post.coverImage}
      date={post.date}
      author={post.author}
      slug={post.slug}
      excerpt={post.excerpt}
      category={post.category}
    />
  ))}
</div>
```

### 2. アニメーションとインタラクション

GSAPを使用して、スムーズなアニメーションを実装：

```typescript
gsap.from(logoRef.current, {
  y: -50,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.2
});
```

## SEO対策

### 1. メタデータの最適化

```typescript
export const metadata: Metadata = {
  title: `${CMS_NAME} - スタートアップ・Web開発・AI情報メディア`,
  description: `東大発スタートアップFutene Web Designが運営するテックメディア。スタートアップ向けホームページ制作、Web開発、AI活用に関する最新情報を発信します。`,
  keywords: ["スタートアップ", "Web開発", "AI", "テックブログ"],
};
```

### 2. 構造化データの実装

記事ページには適切な構造化データを実装し、検索エンジンからの認識を向上。

## 開発効率を上げるためのTips

1. **コンポーネントの再利用**
   - 共通のUIパーツをコンポーネント化
   - Props型の定義による安全な再利用

2. **型定義の活用**
   - インターフェースとタイプの適切な使い分け
   - 型推論を活用した開発効率の向上

3. **効率的なスタイリング**
   - Tailwind CSSのユーティリティクラスを活用
   - カスタムユーティリティの作成

## まとめ

Next.jsとモダンなツール群を組み合わせることで、高機能な技術ブログを短期間で開発することができました。特に以下の点が開発効率の向上に貢献しました：

- Next.js App Routerによる直感的な実装
- TypeScriptによる型安全性の確保
- Tailwind CSSによる効率的なスタイリング
- 豊富なエコシステムの活用

今回の開発経験を通じて、モダンなWeb開発ツールを適切に組み合わせることの重要性を再確認できました。

## 参考リンク

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [KaTeX](https://katex.org/)
- [Zenn](https://zenn.dev/) 