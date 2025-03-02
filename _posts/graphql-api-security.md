---
title: "GraphQL APIの安全運用実践ガイド：認証・認可、DoS対策、Introspection制御"
excerpt: "GraphQLを用いたAPIを安全に運用するためには、認証・認可によるアクセス制御だけでなく、悪意あるクエリによるDoS攻撃対策やレート制限、そしてIntrospection（スキーマの照会機能）の制御など、多面的な対策が必要です。本記事では、JWTやOAuthを用いた認証・認可の実装方法、GraphQL特有のDoS攻撃への対策（クエリ深度制限・コスト分析など）、レート制限の導入方法、Introspectionの無効化について、Node.js + Apollo Serverを例に詳しく解説します。"
coverImage: "/assets/blog/aiagent/cover.jpg"
date: "2025-02-27T12:00:00.000Z"
author:
  name: "Mai Saito"
  picture: "/assets/blog/authors/saitomai.jpg"
ogImage:
  url: "/assets/blog/aiagent/cover.jpg"
category: "backend"
featured: true
---

## はじめに

GraphQLを用いたAPIを安全に運用するためには、認証・認可によるアクセス制御だけでなく、悪意あるクエリによるDoS攻撃対策やレート制限、そしてIntrospection（スキーマの照会機能）の制御など、多面的な対策が必要です。本記事では、**JWTやOAuthを用いた認証・認可の実装方法**、**GraphQL特有のDoS攻撃への対策（クエリ深度制限・コスト分析など）**、**レート制限の導入方法**、**Introspectionの無効化**について、Node.js + Apollo Serverを例に詳しく解説します。

## 1. GraphQLの認証と認可

まずはGraphQL APIへのアクセス制限の基本である認証(Authentication)と認可(Authorization)についてです。GraphQLではエンドポイントが単一でありクエリによって取得データが決まるため、リクエストごとにユーザー情報を判別して適切な権限チェックを行う必要があります。以下では**JWTを用いた認証**, **OAuth（GitHub OAuthを例）による外部認証**, **ロールベースアクセス制御(RBAC)**の実装について説明します。

### JWTを用いた認証の実装方法（Apollo Server + Expressの例）

- *JWT (JSON Web Token)**を使った認証は、シンプルかつ一般的な方法です。クライアントがログイン時にJWTを受け取り、以降のGraphQLリクエストのHTTPヘッダー（例えば`Authorization: Bearer <token>`）にそのトークンを付与します。サーバー側では毎回このトークンを検証し、ユーザー情報を特定してGraphQLのコンテキストに格納します​

。Apollo Serverでは関数内でこれを行います。

例えばApollo ServerをExpressと組み合わせて利用している場合、以下のように**JWT検証とコンテキストへのユーザー情報設定**を行います。

```jsx
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
      const user = await findUserById(decoded.userId);  // データベースなどからユーザー取得
      return { user };
    } catch (err) {
      // トークンが無効な場合はcontextにユーザー情報を入れない
      return { user: null };
    }
  }
});

```

上記では、リクエストヘッダーからJWTを抽出し(`req.headers.authorization`)、`jsonwebtoken`ライブラリで署名検証しています。検証に成功したらトークンに含まれるユーザーID等を元に実際のユーザー情報を取得し、`context`オブジェクトに`user`として設定しています。このようにしておけば、各リゾルバから`context.user`を参照することでリクエストしたユーザーを特定できます​


> ※Apollo Serverのcontextはリクエストごとに生成されるため、レスポンス後にユーザーデータを手動で消去する必要はありません​
> 


### OAuthを使った認証フロー（GitHub OAuthの例）

社外の認証基盤（例えばGitHubやGoogleなど）を利用してログインさせる場合、**OAuth 2.0**による認証フローをGraphQLサーバーに組み込むことも可能です。ここではGitHub OAuthを使ってユーザーを認証し、GraphQL APIにアクセスさせる方法を概説します。大まかな流れは次の通りです​

1. **GitHubアプリの登録**: あらかじめGitHub側でOAuth Appを登録し、クライアントIDとクライアントシークレットを取得します。
2. **クライアントからGitHubへの認可要求**: クライアントアプリはGitHubの認可URL (`https://github.com/login/oauth/authorize`) にクライアントIDなどを付与したURLをユーザーに開かせ、GitHubでのログイン・許可画面へリダイレクトします​。
    
    
3. **GitHubから認可コードの返却**: ユーザーがGitHub上でアプリのアクセスを許可すると、事前に設定したコールバックURLに`code`（認可コード）が付与されてリダイレクトされます (`http://localhost:3000?code=XXXXX` 等)​。
    
    
4. **GraphQLへのコード送信**: クライアントは受け取った認可コードをGraphQLサーバーのミューテーションに渡します（例: `authorizeWithGithub(code: "...")`というミューテーションを呼び出す）​。
    
    
5. **サーバー側でGitHubアクセストークン取得**: GraphQLサーバーのミューテーションリゾルバはGitHubのトークンエンドポイント (`https://github.com/login/oauth/access_token`) に先ほどのコードとクライアントID・シークレットを送信し、**アクセストークン**を取得します​。
    
    
6. **アクセストークンでユーザー情報取得**: 続けてGraphQLサーバーはGitHub API（例えば`https://api.github.com/user`エンドポイント）に先ほどのアクセストークンを付与してユーザー情報（ユーザー名やメールアドレス等）を取得します​。
    
    
7. **アプリ内ユーザーとして登録/ログイン**: 必要に応じて、取得したGitHubユーザー情報を用いて自社アプリ内のユーザーを作成したり、既存ユーザーに関連付けたりします。
8. **認証情報をクライアントに返す**: GraphQLのミューテーションのレスポンスとして、今後の認証に使うトークンをクライアントに返します。ここでは例えば、新規に自社アプリ用のJWTを発行して返すか、またはGitHubアクセストークン自体をクライアントに渡してそれを以降の認証に利用することもあります​。
    
    

以上のステップにより、ユーザーはGitHubアカウントで認証され、GraphQL APIへのアクセス権を得ます。GraphQLサーバー側の実装例として、`authorizeWithGithub`というミューテーションリゾルバを以下に示します。

```jsx

const fetch = require('node-fetch');

async function requestGithubToken(credentials) {
  const res = await fetch('https://github.com/login/oauth/access_token?' +
    `client_id=${credentials.client_id}&client_secret=${credentials.client_secret}&code=${credentials.code}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
  return res.json(); // ここで { access_token: '...', ... } を取得
}

async function requestGithubUser(token) {
  const res = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `token ${token}` }
  });
  return res.json();  // GitHubユーザーのプロフィール情報を取得
}

const resolvers = {
  Mutation: {
    authorizeWithGithub: async (_, { code }, { db }) => {
      // 5. 認可コードからGitHubアクセストークン取得
      const { access_token } = await requestGithubToken({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      });
      if (!access_token) {
        throw new Error("GitHub token retrieval failed");
      }
      // 6. アクセストークンでGitHubユーザー情報取得
      const githubUser = await requestGithubUser(access_token);
      // 7. 自アプリのユーザーとして登録 or 特定（DB利用）
      let appUser = await db.findUser({ githubId: githubUser.id });
      if (!appUser) {
        appUser = await db.createUser({
          githubId: githubUser.id,
          name: githubUser.name || githubUser.login,
          avatar: githubUser.avatar_url
        });
      }
      // 8. JWT発行（自前のJWTにGitHub ID等を入れる例）
      const token = jwt.sign({ userId: appUser.id }, SECRET_KEY);
      return { token, user: appUser };
    }
  }
};

```

このミューテーションでは、GitHubから取得した`access_token`およびユーザー情報を使って自アプリ内のユーザーを特定・作成し、そのユーザーに対応するJWTを新たに発行して返しています。以降は前述のJWT認証の仕組みと同様に、クライアントはこのJWTを用いてGraphQLクエリを発行することができます。

> ※上記は一例であり、実際にはエラー処理やセキュリティ考慮（例えばGitHubからのレスポンス検証など）を適切に行う必要があります。
> 

### ロールベースアクセス制御（RBAC）とフィールドごとの制限方法

認証によりユーザーが特定できたら、次は**認可(Authorization)**によってユーザーの権限に応じたデータアクセス制御を行います。**ロールベースアクセス制御（RBAC: Role-Based Access Control）**は、ユーザーに役割（ロール）を与え、ロールごとにアクセス可能なリソースや操作を制限する手法です。GraphQLにおいてRBACを実現する方法はいくつかあります。

**1. リゾルバ内でのロールチェック**: 最も直接的なのは、各フィールドのリゾルバ関数内で`context.user`のロールを確認し、不適切なアクセスならエラーを投げたり`null`を返したりする方法です。例えば、全ユーザー一覧を返す`users`クエリを**管理者ロール("admin")のユーザーのみ**実行可能にしたい場合、以下のようにします。

```jsx

const resolvers = {
  Query: {
    users: (parent, args, context) => {
      if (!context.user || !context.user.roles.includes('admin')) {
        // 未認証あるいはadminロールでない場合はアクセス拒否
        throw new Error("Not authorized to view all users");
        // または単に return null として許可しないようにする方法もあります
      }
      return context.dataSources.User.getAll();  // 全ユーザー取得処理
    }
  }
};

```

上記のように、resolver内で`context.user`の存在やロールを確認し、不許可の場合は早期にreturnしたりエラーを投げます。Apollo Serverの公式ドキュメントでも、`admin`ロールを要求する例として同様のコードが紹介されています​

。このようにすることで、条件を満たさない場合にはデータベースに問い合わせる処理自体をスキップでき、無駄な負荷や不要なエラー露出を防げるメリットがあります​

**2. カスタムディレクティブによる制御**: 

GraphQLスキーマレベルで認可ルールを表現したい場合、**スキーマディレクティブ**を使う方法があります。例えば、`@auth(requires: ADMIN)`のようなディレクティブをスキーマに定義し、それをフィールドやオブジェクトタイプに付与しておけば、リゾルバ実行時に共通のロジックでロール検証が可能です
ディレクティブ実装では、各フィールドのリゾルバをwrapして認可チェックを挟み込むような処理を行います。Apollo Serverではgraphql-toolsのmap Schemaユーティリティなどを用いてディレクティブによる一括処理を実装できます

例えば、以下のようなスキーマディレクティブを定義したとします（TypeScriptの型やApolloServerの設定は省略）。

```graphql

directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  USER
}

type User @auth(requires: USER) {
  name: String
  secretInfo: String @auth(requires: ADMIN)
}

```

`@auth`ディレクティブを付与したフィールドは、リゾルバ実行前にそのユーザーが要求されたロールを持つかチェックする処理を組み込めます。この方法ではスキーマに認可要件が明示されるため分かりやすく、認可ロジックを各所に重複して書く必要がありません。ただし実装の手間がややかかる点と、複雑な条件（オブジェクトの内容に応じた許可など）が必要になるとディレクティブのコードが煩雑になるという面もあります。

**3. 専用ライブラリの利用（GraphQL Shieldなど）**: GraphQLの認可を簡潔に記述できるライブラリとして**graphql-shield**が広く利用されています​

。GraphQL Shieldでは「ルール」を宣言的に定義し、それをスキーマのタイプやフィールドにマッピングすることで認可ミドルウェア層を実現します。例えば、

```
isAdmin
```

というルールを定義して

```
Query.users
```

に適用すれば、上記と同様にadminロールのみ

```
users
```

クエリを許可する、といった設定を簡単に書くことができます。

```java

const { rule, shield, and, or, not } = require('graphql-shield');

const isAuthenticated = rule()(async (parent, args, context) => {
  return context.user != null;
});
const isAdmin = rule()(async (parent, args, context) => {
  return context.user && context.user.roles.includes('admin');
});

const permissions = shield({
  Query: {
    users: and(isAuthenticated, isAdmin),  // 認証済みかつadminロールに限定
    viewerData: isAuthenticated            // 誰でも認証さえしていれば可 等
  }
  // Mutationやフィールド単位でも定義可能
});

// これをApollo Serverに適用（v2の場合）:
// const server = new ApolloServer({ typeDefs, resolvers, middleware: [permissions] });

```

上記のようにGraphQL Shieldを使うと、権限ルールを別レイヤーで管理でき、**認可ロジックの再利用**や**テスト**もしやすくなります。小規模なプロジェクトではまずリゾルバ内のシンプルなチェックから始め、必要に応じてディレクティブやShieldの導入を検討すると良いでしょう。

## 2. DoS攻撃への対策

GraphQLサーバーは柔軟なクエリに対応できる反面、工夫しないとクエリの複雑さを悪用した**サービス拒否(DoS)攻撃**に晒される可能性があります。たとえば極端にネストの深いクエリや、大量のフィールドを含むクエリを送りつけられると、サーバーの処理負荷が大きく跳ね上がり他のリクエストに支障をきたします。ここではGraphQL特有のクエリ制限手法である**クエリ深度の制限**, **クエリ幅（エイリアス数・フィールド数）の制限**, **クエリコスト分析**について解説します。

### クエリの深さ制限の設定方法

GraphQLのクエリはネストが可能ですが、**ネストの深さ(depth)が深くなればなるほどサーバー側でのデータ取得コストが指数的に増大し得ます​**

**。そこで、事前に最大クエリ深度**を定め、それを超えるクエリは受け付けないようにするのが有効です。Apollo Serverを含む多くのGraphQLサーバーでは、クエリ解析時にカスタムの**バリデーションルール**を追加できます。オープンソースライブラリの**`graphql-depth-limit`**を使うと、このルールを簡単に導入できます

。例えばApollo Server (Express)での利用例：

```jsx

const depthLimit = require('graphql-depth-limit');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [ depthLimit(5) ]  // 最大ネスト深度を5に設定
});

```

上記の設定では、クエリAST（抽象構文木）を解析し、入れ子の深さが5を超えるようなクエリは**バリデーションエラー**として処理されます。Apollo ServerのミドルウェアとしてExpressに組み込んでいる場合も、`applyMiddleware`時に同様のオプションを渡せます。実装は非常に簡単で、Apollo社のブログでも「深度制限はこれほどシンプルです！」と紹介されています。

例えば、次のようなクエリを想定します（深度が深いネスト構造）:

```graphql

query nested {
  level1 {
    level2 {
      level3 {
        level4 {
          value
        }
      }
    }
  }
}

```

上記は深度4ですが、この構造をさらに深くネストしたリクエストが来ても、サーバー側で「深度が深すぎる」と判断して弾くことが可能です。一般的には自分たちのアプリで実際に必要となる最大深度＋α程度に設定します（例えば通常3段階までしかネストしないなら5程度に設定）。深度制限はGraphQL特有の**再帰的クエリ爆発**を防ぐ基本的な防御策となります​

### クエリの幅制限（エイリアス数、フィールド数の制限）

クエリの**幅**とは、一度のクエリで**どれだけ多数のフィールドやエイリアスを指定しているか**を指します。GraphQLでは同じフィールドを異なるエイリアス名で複数回リクエストすることができます。悪意のあるユーザーはこの仕組みを利用して、1回のリクエスト内で**大量の繰り返しクエリ**を発行し、サーバーに高負荷をかける可能性があります​

。例えば:

```graphql
graphql
コピーする編集する
query manyBooks {
  b1: book(id: "1") { title }
  b2: book(id: "1") { title }
  ...
  b1000: book(id: "1") { title }
}

```

上記のように`book`という同じクエリを1000個のエイリアス(`b1`〜`b1000`)で反復すると、一度のHTTPリクエストで1000回分の処理をさせることができます。この**エイリアスの乱用(Alias Overloading)**はGraphQL特有のDoS手法です​

これを防ぐため、**エイリアスの個数**や**トップレベルのフィールド数**にも上限を設けることが重要です。Apolloの新しいRouter（ゲートウェイ）では、設定ファイルで`max_aliases`や`max_root_fields`といったパラメータで制限を掛けることができます​

。例えばApollo Routerの設定ではデフォルトで

```
max_aliases: 30
```

（エイリアスは30個まで）,

```
max_root_fields: 20
```

（クエリやミューテーションでトップレベルに指定できるフィールドは20個まで）といった具合です​

。もしこれを超過したリクエストが来た場合、Routerはそのリクエストを

**400エラー**

で拒否します（エラーメッセージには「Maximum aliases limit exceeded」のような説明が含まれます）。

独立したApollo Routerを使わない場合でも、`graphql-depth-limit`のようなライブラリやカスタムバリデーションで同様のチェックを実装可能です。クエリASTを走査してエイリアスの数や、全選択フィールドの総数をカウントし、閾値を超えたらエラーとする処理を入れます。もしくは**ホワイトリスト**方式で「許可するクエリパターン」を限定する手法もありますが、GraphQLの柔軟性を損なうため利用シーンは限定的です​

適切な幅制限を導入することで、「1回のクエリで過剰なデータ取得を要求する」ような攻撃を緩和できます。特にPublic APIとしてGraphQLを提供する場合は必須の対策と言えるでしょう。

### クエリのコスト分析とスコアリング（Complexity Analysis）

深度やフィールド数の制限は有効ですが、それだけでは測れない**クエリの重さ**も存在します​

。例えば、深度も項目数もそれほど多くなくとも、バックエンドで大量のデータベースアクセスを引き起こすパターンのクエリがあります。**クエリコスト分析(Query Cost/Complexity Analysis)**は各フィールドの「コスト」を定義し、クエリ全体の合計コストが一定以上であれば拒否するという高度な対策です。

実例として、GitHubのGraphQL APIでは**ポイント制による複雑度管理**が行われており、ユーザーは1時間に5000ポイント、1分間に2000ポイントまでという形でクエリ実行量が制限されています​

。各クエリが何ポイントかはGitHubが定めた計算法（ノード数やデータ量に基づく）によって算出されます。例えば、100個のリポジトリとそれぞれに関連する50個のIssue、各Issueに60個のLabelを取得するようなクエリは、内部的に約5101リクエスト相当（=51ポイント）と計算されます。

自前のGraphQLサーバーでコスト分析を導入するには、一般的に次のような手順を踏みます。

1. **各フィールドにコスト係数を定義**: 例えば単純なスカラー値を返すフィールドは1、リストを返すフィールドは要素数に応じてコスト増加、といったルールを決めます。
2. **クエリ解析時に合計コストを算出**: クエリASTを走査し、上記で定義した係数に従って全フィールドのコスト総和を計算します。リストフィールドの場合は引数で指定された取得件数（例えば`first: 100`など）も考慮して乗算します。
3. **閾値を超えたらリクエスト拒否**: 合計コストが事前に定めた上限を超える場合、エラーを返して処理を中断します。

幸い、GraphQLJSにはこうした複雑度計算のためのライブラリがいくつか存在します。Apolloのブログでも、いくつかのOSSパッケージが紹介されています​

。代表的なものに**

```
graphql-query-complexity
```

**（複雑度計算用バリデーションルールを提供）や、**

```
graphql-cost-analysis
```

- *（スキーマに

```
@cost
```

ディレクティブを追加して柔軟にコスト定義可能）が挙げられます。前者はシンプルに各フィールドにデフォルト値1のコストを割り当てつつ必要に応じてカスタム設定ができます。後者はスキーマSDL上で「このフィールドのコストは5、子フィールドは取得件数×2倍」などと細かく指定できる強力な方式です。

**graphql-query-complexityの基本的な使い方**は次のとおりです。

```jsx

const { createComplexityRule, simpleEstimator, fieldExtensionsEstimator }
  = require('graphql-query-complexity');

const complexityRule = createComplexityRule({
  maximumComplexity: 100,  // 最大許容複雑度
  estimators: [
    fieldExtensionsEstimator(),  // フィールドに拡張でcomplexity設定があれば考慮
    simpleEstimator({ defaultComplexity: 1 })  // デフォルトは1
  ],
  onComplete: (complexity) => {
    console.log('Determined query complexity:', complexity);
  }
});

// ApolloServerの設定に追加
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [ complexityRule ]
});

```

上記では、まず最大複雑度を100とし、各フィールドは基本コスト1で計算、もしスキーマのフィールド定義側で独自の複雑度設定があればそれを使う（`fieldExtensionsEstimator`）というルールを作成しています。`onComplete`で算出された複雑度をログ出力しておくと、どのクエリがどの程度のスコアだったか監視するのに役立ちます。

より細かく制御したい場合は、スキーマ定義でフィールド拡張metadataとしてコストを設定することもできますし（`graphql-query-complexity`ではフィールド定義に`complexity`関数を指定可能）、あるいは`graphql-cost-analysis`を使ってスキーマSDL内に`@cost`ディレクティブを付与する方法もあります​

。例えば：

```graphql

type Query {
  searchArticles(keyword: String!, limit: Int!): [Article] @cost(complexity: 5, multipliers: ["limit"])
}

```

このようにしておけば、`limit`に応じてコストが動的に計算され、最終的なスコアが決まります。運用上はまず**深度制限と取得件数制限**（後述の「幅制限」の一種）を最低限の防御策として導入し、それでも防ぎきれない複雑なクエリパターンが問題となる場合にコスト分析の実装を検討するとよいでしょう。

## 3. レート制限の導入方法

**レート制限（Rate Limiting）は一定時間あたりのリクエスト数を制限することで、過剰なアクセスやブルートフォース攻撃を防ぐ仕組みです。GraphQLの場合も基本的な考え方はREST APIと同様ですが、単一エンドポイントである点や、1リクエスト内で複数のクエリをバッチできる点を考慮する必要があります。ここではクライアントごとのレート制限**, **バッチクエリの制限**, **タイムアウトの設定**について述べます。

### クライアントごとにレート制限をかける方法（Redis + Express Rate Limit）

レート制限を実装する一般的な方法は、**IPアドレス**や**ユーザーID/APIキー**ごとに一定期間あたりのリクエスト数をカウントし、上限を超えた場合にエラーを返すことです

。Node.js環境では

**Expressミドルウェア**

として簡単に導入できるライブラリがあり、その代表が

```
express-rate-limit
```

です。これをGraphQLサーバーのエンドポイント（例えば

```
/graphql
```

）に適用すれば、GraphQLであるか否かに関わらず

**HTTPリクエストレベル**

での制限が可能です。

**Redisを用いた分散環境対応**: 単一サーバー内で完結するならメモリ上でカウントするだけでも良いですが、スケールアウトや再起動後も制限カウントを保持したい場合は外部ストアが必要です。`express-rate-limit`用には公式のRedisストア(`rate-limit-redis`)が提供されています​

[github.com](https://github.com/express-rate-limit/rate-limit-redis#:~:text=%2F%2F%20Redis%20store%20configuration%20store%3A,app.use%28limiter)

。これを利用すると、各クライアント（デフォルトではIPアドレス）ごとのリクエスト数をRedisに記録し、複数サーバー間で共有できます。

**実装例**: 1分間に100リクエストまでに制限する場合を想定します。

```jsx

const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');

const redisClient = createClient({ /* Redis接続設定 */ });
redisClient.connect();  // Redisサーバーに接続

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1分間のウィンドウ
  max: 100,             // 1分あたり100リクエストまで許可
  standardHeaders: true, // RateLimitヘッダーを有効化
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  })
});

// GraphQLエンドポイントにレートリミッターを適用
app.use('/graphql', limiter);

```

上記を設定すると、同一IPからのGraphQLエンドポイントへのリクエストは1分間に100回までに制限されます。制限を超えるとHTTPステータス429 (Too Many Requests)が返され、一定時間アクセスがブロックされます。`standardHeaders`オプションにより、レスポンスヘッダーに残り回数やリセット時間が含まれるため、クライアント側でスロットル制御する際にも役立ちます。

**ユーザー単位の制限**: IPアドレスではなく認証ユーザーごとに制限したい場合もあります。その場合はリクエスト毎にキーを決定する関数（`keyGenerator`）を指定し、`req`から例えば`req.user.id`を取り出してキーに使うよう実装します。ただしGraphQLでは上記ミドルウェアが実行される段階では認証ヘッダーの解析前かもしれないため、認証ミドルウェアとの順序に注意してください。Apollo Serverの`context`で認証したユーザーIDをExpress側に渡すのは難しいため、一般には**IPベース**で十分とされます

### バッチクエリの制限

Apollo Clientなどでは、複数のGraphQLクエリを1つのHTTPリクエストにまとめて送信する**バッチ機能**があります。例えば、2つのクエリを配列としてまとめてPOSTすると、サーバーはそれぞれを実行して結果を配列で返します。便利な機能ですが、レート制限の観点では「1リクエストで複数クエリを実行される」ことになるため、単純な**リクエスト数**カウントでは見逃してしまう可能性があります。

対策としては:

- **バッチリクエストを許可しない**: サーバー側で配列によるGraphQLリクエストを受け付けない設定にする（多くの場合デフォルトで配列は受理しません）。必要な場合だけ限定的に使う。
- **バッチ内クエリ数も制限する**: バッチの配列長に上限を設けます（例えば一度に5クエリまでなど）。Apollo Serverでは直接そのようなオプションはありませんが、Expressミドルウェアでリクエストボディをチェックすることもできます。
- **各クエリを個別にカウント**: バッチであっても内部でループして各クエリ実行時にレート制限のカウンタをデクリメントするような仕組みを作ることも考えられます。

また、**エイリアス**を用いて1クエリ内に複数の同一フィールドを呼ぶケース（前述）も、広義には「疑似バッチ」と言えます。これは深度・幅制限や複雑度制限で対処すべき事柄ですが、レート制限としても**「1リクエスト=1操作」に近い形に制限する**ポリシーが重要です。

つまり、GraphQLの柔軟性ゆえに**「見かけのリクエスト数以上の負荷」**をかけられる点を考慮し、単純なリクエストカウント以上の視点で設計する必要があります。実運用では「通常どのくらいの頻度でどのクエリが呼ばれるか」を計測し、それを大きく逸脱するようなパターンを検知・制限する仕組み（たとえば特定クエリについてだけ個別に回数制限を設ける等）も有効でしょう。

### タイムアウトの設定

最後に、**クエリのタイムアウト**について触れます。GraphQLではクエリが複雑だったりDB応答が遅かったりすると、レスポンスに長い時間がかかる場合があります。最悪の場合、サーバーがクエリ処理を延々と続けてしまい、新しいリクエストを捌けなくなる恐れもあります。

そこで、**一定時間（例: 5秒）を超えて処理が完了しないクエリは強制的に中断する**仕組みを入れることが望ましいです。具体的な実装方法は環境によって異なりますが、いくつか考えられます。

- **HTTPサーバーレベルのタイムアウト**: Node.jsのHTTPサーバーや、あるいはリバースプロキシ（NGINXなど）のタイムアウト設定を利用します。例えばNGINXの`proxy_read_timeout`を10秒に設定すれば、バックエンドがそれ以上時間を要する場合クライアントへの接続を切ります。Apollo Server自体にはクエリタイムアウトの直接的な設定はありませんが、外側でタイムアウト制御が可能です。
- **Resolverレベルでのタイムアウト**: 各リゾルバ関数内でPromiseを扱っている場合、`Promise.race`を使ってタイムアウト用のPromiseとどちらが先に完了するか競わせる方法があります。一定時間内にDB呼び出し等が完了しなければrejectしてエラーにする実装です。
- **ライブラリの利用**: ApolloのRouterでは「リクエストタイムアウト」相当の仕組みが組み込まれている場合があります​。また、コミュニティには`apollo-link-timeout`（クライアント側でのタイムアウト制御）や`graphql-timeout`（サーバー側でタイムアウトをエラーとして返す）といったツールもあります。
    
    

重要なのは、無制限に遅いクエリを許してしまわないことです。例えば**10秒**など現実的な上限を設けておけば、意図しない過負荷状態から比較的早く復旧できます。タイムアウトした場合のクライアントエラー処理（リトライするのか諦めるのか）も合わせて設計しましょう。

なお、タイムアウトは正規のクエリにも影響し得るため設定値は慎重に決める必要があります。過度に短いと有用なクエリまで失敗してしまい、逆に長すぎると効果がなくなります。アプリケーションログなどから**平均・最悪応答時間**を計測し、適切な閾値を見極めることが大切です。

## 4. Introspectionの制御

GraphQLの**Introspection（イントロスペクション）機能は、クライアントがスキーマの型情報やフィールド一覧を取得できる強力な仕組みです。開発時にはGraphiQLやApollo Sandboxなどでスキーマを確認できて便利ですが、本番環境ではこの機能を有効にしておくことはセキュリティ上のリスク**になり得ます。

### 本番環境でIntrospectionを無効化する方法

GraphQLサーバーでは、**本番ではスキーマのIntrospectionを無効化する**のが一般的なセキュリティ対策です​

。Introspectionクエリ（

```
{ __schema { ... } }
```

など）を無効化することで、悪意ある第三者がシステム内部のGraphQL型構造を丸裸にするのを防ぎます​

(https://www.apollographql.com/docs/graphos/platform/security/overview#:~:text=GraphQL%27s%20built,prevent%20this%2C%20turn%20off%20introspection)

。スキーマの詳細が分からなければ、攻撃者は有効なクエリを推測するのが難しくなり、防御の一助となります。

Apollo Serverの場合、サーバーインスタンスを構築する際にオプションで`introspection: false`を指定するだけでイントロスペクションを拒否できます。例えば:

```jsx

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: false,       // 本番ではスキーマの照会を無効化
  plugins: [ApolloServerPluginLandingPageDisabled()]  // （任意）Playgroundも無効化
});

```

上記のように設定すれば、本番環境で誤ってGraphQL IDE（PlaygroundやSandbox）を有効にしてしまい、誰でもスキーマを引ける状態になる事態を防げます。また、Apollo Server 3以前では`playground: false`オプションを指定することでGraphQL Playground（ブラウザ上のクエリエディタ）も停止できます。

Expressの`express-graphql`を使っている場合も、オプション`graphiql: false, introspection: false`を指定することで同様に無効化可能です。

### Introspectionを無効化することのメリット・デメリット

**メリット**: 繰り返しになりますが、一番の利点は**攻撃者にスキーマ情報を与えない**ことです。IntrospectionはGraphQLの型構造・フィールド・引数などあらゆる情報を取得できるため、これが有効だと**非常に短時間でAPIの全貌を調査されてしまいます**​

。無効化しておけば、少なくとも攻撃者は有効なクエリを当てずっぽうで探すしかなくなり、難易度が上がります。セキュリティにおいて「情報を隠す」ことは完全ではないにせよ重要な防御の一つです。

**デメリット**: 開発者や正規ユーザーにとっては不便になる場合があります。例えば社内向けAPIであれば、利用者がスキーマを照会できた方が開発効率が上がるでしょう。また、一部のクライアントツールや自動ドキュメント生成はIntrospectionに依存しています。本番環境でもApollo Studioなど正規のクライアントにはスキーマを提供したいケースでは、完全に無効化するのではなく**認証ユーザーにだけ許可する**といった実装も考えられます。ただしそのような細かい制御はGraphQLサーバー単体では難しいため、通常は**非公開API or 内部APIなら有効でも許容、公開APIなら無効化**という方針が取られます。

もう一点、Introspectionを無効にしていても**エラーメッセージ**などからスキーマ情報が漏れる可能性には注意が必要です。たとえば存在しないフィールド名でクエリを投げた際に「フィールドXはタイプYに存在しません」と詳細に返してしまうと、それだけでタイプYにフィールド一覧を推測されるヒントを与えてしまいます。そこで**エラー詳細を隠蔽（フレンドリーメッセージに差し替える）**することも重要です​

。Apollo Serverではデフォルトであまり内部情報を出さない設計ですが、カスタムエラーを投げる際などはメッセージに注意しましょう。

---

以上、GraphQL APIの認証・認可から始まり、クエリ悪用による攻撃対策、レート制限、Introspection制御まで幅広く解説しました。GraphQLは強力な技術ですが、その柔軟性ゆえにセキュリティ面では従来のRESTとは異なる配慮が必要です。本記事で紹介した対策を組み合わせて適用することで、GraphQLサーバーの防御力を高めることができます。**深度制限と取得件数制限**は最低限導入し、必要に応じて**複雑度（コスト）分析**も検討するとよいでしょう​

また、認証・認可を適切に実装し、過剰なトラフィックやスキーマ漏洩のリスクを減らすことで、安心してGraphQLの利点を享受できるはずです。
GraghQLはイケてる技術ですが、セキュリティ面でのベストプラクティスの日本語情報を探すのが難しいのが現状だと思います。この記事がなんらかの役に立てば幸いです。