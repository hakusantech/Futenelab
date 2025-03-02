---
title: "GraphQL APIの安全運用実践ガイド：認証・認可、DoS対策、Introspection制御"
excerpt: "GraphQLを用いたAPIを安全に運用するためには、認証・認可によるアクセス制御だけでなく、悪意あるクエリによるDoS攻撃対策やレート制限、そしてIntrospection（スキーマの照会機能）の制御など、多面的な対策が必要です。本記事では、JWTやOAuthを用いた認証・認可の実装方法、GraphQL特有のDoS攻撃への対策（クエリ深度制限・コスト分析など）、レート制限の導入方法、Introspectionの無効化について、Node.js + Apollo Serverを例に詳しく解説します。"
coverImage: "/assets/blog/aiagent/cover.jpg"
date: "2025-02-27T12:00:00.000Z"
author:
  name: "saitomai"
  picture: "/assets/blog/authors/saitomai.jpeg"
ogImage:
  url: "/assets/blog/aiagent/cover.jpg"
category: "backend"
featured: true
---

## はじめに

GraphQLを用いたAPIを安全に運用するためには、認証・認可によるアクセス制御だけでなく、悪意あるクエリによるDoS攻撃対策やレート制限、そしてIntrospection（スキーマの照会機能）の制御など、多面的な対策が必要です。本記事では、JWTやOAuthを用いた認証・認可の実装方法、GraphQL特有のDoS攻撃への対策（クエリ深度制限・コスト分析など）、レート制限の導入方法、Introspectionの無効化について、Node.js + Apollo Serverを例に詳しく解説します。

## 1. GraphQLの認証と認可

まずはGraphQL APIへのアクセス制限の基本である認証(Authentication)と認可(Authorization)についてです。GraphQLではエンドポイントが単一でありクエリによって取得データが決まるため、リクエストごとにユーザー情報を判別して適切な権限チェックを行う必要があります。

### JWTを用いた認証の実装方法（Apollo Server + Expressの例）

JWT (JSON Web Token)を使った認証は、シンプルかつ一般的な方法です。クライアントがログイン時にJWTを受け取り、以降のGraphQLリクエストのHTTPヘッダー（例えばAuthorization: Bearer <token>）にそのトークンを付与します。

```typescript
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'YOUR_JWT_SECRET_KEY';  // JWT署名検証用の秘密鍵

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      // JWTを検証し、デコードされたユーザー情報を取得
      const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
      const user = await findUserById(decoded.userId);
      return { user };
    } catch (err) {
      return { user: null };
    }
  }
});
```

### OAuthを使った認証フロー（GitHub OAuthの例）

外部の認証基盤を利用する場合、OAuth 2.0による認証フローを実装します。以下はGitHub OAuthを例にした実装です：

```typescript
const resolvers = {
  Mutation: {
    authorizeWithGithub: async (_, { code }, { db }) => {
      // GitHubアクセストークン取得
      const { access_token } = await requestGithubToken({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      });
      
      // GitHubユーザー情報取得
      const githubUser = await requestGithubUser(access_token);
      
      // アプリ内ユーザーとして登録/特定
      let appUser = await db.findUser({ githubId: githubUser.id });
      if (!appUser) {
        appUser = await db.createUser({
          githubId: githubUser.id,
          name: githubUser.name
        });
      }
      
      // JWT発行
      const token = jwt.sign({ userId: appUser.id }, SECRET_KEY);
      return { token, user: appUser };
    }
  }
};
```

### ロールベースアクセス制御（RBAC）の実装

ユーザーのロールに基づいてアクセス制御を行う例を示します：

```typescript
const resolvers = {
  Query: {
    users: (parent, args, context) => {
      if (!context.user || !context.user.roles.includes('admin')) {
        throw new Error("Not authorized to view all users");
      }
      return context.dataSources.User.getAll();
    }
  }
};
```

## 2. DoS攻撃への対策

GraphQL特有のDoS攻撃対策として、クエリの深度制限、幅制限、コスト分析について解説します。

### クエリの深度制限

```typescript
const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [ depthLimit(5) ]  // 最大ネスト深度を5に設定
});
```

### クエリのコスト分析

```typescript
const { createComplexityRule } = require('graphql-query-complexity');

const complexityRule = createComplexityRule({
  maximumComplexity: 100,
  estimators: [
    fieldExtensionsEstimator(),
    simpleEstimator({ defaultComplexity: 1 })
  ]
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [ complexityRule ]
});
```

## 3. レート制限の導入

### Redisを使用したレート制限の実装

```typescript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1分間
  max: 100,             // 最大100リクエスト
  store: new RedisStore({
    client: redisClient
  })
});

app.use('/graphql', limiter);
```

## 4. Introspectionの制御

本番環境でのIntrospection無効化：

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});
```

## まとめ

GraphQL APIの安全な運用には、以下の対策を組み合わせることが重要です：

1. 適切な認証・認可の実装
2. クエリの深度制限とコスト分析によるDoS対策
3. レート制限による過剰なアクセスの防止
4. 本番環境でのIntrospection無効化

これらの対策を適切に実装することで、GraphQLの利点を活かしつつ、セキュアなAPIを提供することができます。

## 参考リンク

- [Apollo Server Security](https://www.apollographql.com/docs/apollo-server/security/)
- [GraphQL Security Checklist](https://graphql.org/learn/best-practices/#security)
- [GitHub GraphQL API](https://docs.github.com/en/graphql) 