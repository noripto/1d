/** リポジトリオーナー情報 */
export type RepositoryOwner = {
  login: string;
  avatarUrl: string;
};

/** プログラミング言語 */
export type Language = {
  name: string;
  color: string;
} | null;

/** リポジトリ検索結果の各アイテム */
export type RepositorySearchItem = {
  id: string;
  name: string;
  owner: RepositoryOwner;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: Language;
  url: string;
};

/** ページネーション情報 */
export type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
};

/** リポジトリ検索レスポンス */
export type SearchRepositoriesResponse = {
  search: {
    repositoryCount: number;
    pageInfo: PageInfo;
    nodes: (RepositorySearchItem | null)[];
  };
};

/** リポジトリ詳細情報 */
export type RepositoryDetail = {
  id: string;
  name: string;
  owner: RepositoryOwner;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: Language;
  watchers: {
    totalCount: number;
  };
  issues: {
    totalCount: number;
  };
  createdAt: string;
  updatedAt: string;
};

/** リポジトリ詳細取得レスポンス */
export type GetRepositoryResponse = {
  repository: RepositoryDetail | null;
};
