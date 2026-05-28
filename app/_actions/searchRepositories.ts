"use server";

import type {
  PageInfo,
  RepositoryDetail,
  RepositorySearchItem,
} from "@/lib/types/github";

const BASE = "https://api.github.com";
const PER_PAGE = 30;
const HEADERS = { Accept: "application/vnd.github+json" };

type Owner = { login: string; avatar_url: string };

type Repository = {
  id: number;
  name: string;
  owner: Owner;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
};

type RepositoryDetailResponse = Repository & {
  subscribers_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
};

type SearchResponse = {
  total_count: number;
  items: Repository[];
};

function mapRepository(r: Repository): RepositorySearchItem {
  return {
    id: String(r.id),
    name: r.name,
    owner: { login: r.owner.login, avatarUrl: r.owner.avatar_url },
    description: r.description,
    stargazerCount: r.stargazers_count,
    forkCount: r.forks_count,
    primaryLanguage: r.language ? { name: r.language, color: "" } : null,
    url: r.html_url,
  };
}

export type SearchRepositoriesResult = {
  repositories: RepositorySearchItem[];
  totalCount: number;
  pageInfo: PageInfo;
};

export async function searchRepositories(
  query: string,
  after?: string,
): Promise<SearchRepositoriesResult> {
  if (!query.trim()) {
    return {
      repositories: [],
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    };
  }

  const page = after ? parseInt(after, 10) : 1;
  const url = new URL(`${BASE}/search/repositories`);
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), {
    headers: HEADERS,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data: SearchResponse = await res.json();
  const hasNextPage = data.total_count > page * PER_PAGE;

  return {
    repositories: data.items.map(mapRepository),
    totalCount: data.total_count,
    pageInfo: {
      hasNextPage,
      endCursor: hasNextPage ? String(page + 1) : null,
    },
  };
}

export async function getRepository(
  owner: string,
  name: string,
): Promise<RepositoryDetail | null> {
  const res = await fetch(`${BASE}/repos/${owner}/${name}`, {
    headers: HEADERS,
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const result: RepositoryDetailResponse = await res.json();
  return {
    id: String(result.id),
    name: result.name,
    owner: { login: result.owner.login, avatarUrl: result.owner.avatar_url },
    description: result.description,
    url: result.html_url,
    stargazerCount: result.stargazers_count,
    forkCount: result.forks_count,
    primaryLanguage: result.language
      ? { name: result.language, color: "" }
      : null,
    watchers: { totalCount: result.subscribers_count },
    issues: { totalCount: result.open_issues_count },
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}
