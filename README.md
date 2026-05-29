## 概要

**こちらはGitHub GraphQL APIでの実装です。ご確認頂く際にGitHubのPersonal Access Tokenが必要となります。**  
（ご確認頂く際にお手数かと思い、REST版での実装も[/feature/rest_api](https://github.com/noripto/1d/tree/feature/rest_api)のブランチで行っています。APIおよびテスト部分以外は同一の内容です。）


## 環境構築

envファイルに下記の値を設定
```
GITHUB_GRAPHQL_ENDPOINT=https://api.github.com/graphql
GITHUB_TOKEN=[取得したPersonal Access Token]
```

パッケージインストール
```bash
pnpm install
```

ローカルサーバ起動
```bash
pnpm dev
```

## 使用技術

| カテゴリ | 採用技術 |
|---------|---------|
| フレームワーク | Next.js 16 (App Router) |
| データ取得 | GitHub GraphQL API + Apollo Client v4 |
| UI コンポーネント | shadcn/ui + Radix UI |
| スタイリング | Tailwind CSS v4 |
| Linter / Formatter | Biome |
| テスト | Vitest + Testing Library |

## テスト
Vitestで関数およびコンポーネントのテストを行えるようにしています。
```bash
pnpm test:run
```

## 工夫した点
無限スクロール周り  
- 詳細ページ遷移後のスクロール位置の記憶  
詳細ページ遷移後にブラウザバックを行った際、contextとフックを使用しスクロール位置およびページネーション（ここでは無限スクロールなのでカーソル位置という意味で）を保存し違和感なく戻れるようにしました。

- 無限スクロール周りのロジックをフックに分離した  
今回は再利用を行う箇所はありませんが、プロダクションを想定して単純にロジックを分離して抽象化し他ページなどで必要な場合に使いまわせる形にしました。  
また、フックはジェネリクス型や関数を受け取れる形にすることでGitHub APIに関わらず汎用的に使えるようにしました。

## こだわった点  
- サーバコンポーネントとクライアントコンポーネントの分離  
今回は無限スクロールを採用したため、データフェッチとインタラクションのどちらも起こりますが初回のデータフェッチをサーバコンポーネント（RepositoryList.tsx）、無限スクロール部分をクライアントコンポーネント（RepositoryListInfinite.tsx）と分離することで、初めからクライアントフェッチを行って状態や副作用を持たなくても良い様にSSRと無限スクロールを両立させています。

- useEffectやuseStateを極力減らした  
useEffectの意図しない発火やstateの更新による意図しない再レンダリングなどを極力起こさないようにサーバコンポーネントを中心に設計しました。

## AI利用について  
複雑なロジックを含まないコンポーネントやスタイリング周りはClaude Code(Opus4.7)を利用しました。
