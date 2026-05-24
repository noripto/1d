"use server";

import { getClient } from "@/lib/api/client";
import { GET_REPOSITORY, SEARCH_REPOSITORIES } from "@/lib/graphql/queries";
import type {
  GetRepositoryResponse,
  RepositoryDetail,
  RepositorySearchItem,
  SearchRepositoriesResponse,
} from "@/lib/types/github";

export type SearchRepositoriesResult = {
  repositories: RepositorySearchItem[];
  totalCount: number;
};

export async function searchRepositories(
  query: string,
): Promise<SearchRepositoriesResult> {
  if (!query.trim()) {
    return { repositories: [], totalCount: 0 };
  }

  const { data } = await getClient().query<SearchRepositoriesResponse>({
    query: SEARCH_REPOSITORIES,
    variables: { query, first: 30 },
  });

  const repositories =
    data?.search.nodes.filter(
      (node): node is RepositorySearchItem => node !== null,
    ) ?? [];

  return {
    repositories,
    totalCount: data?.search.repositoryCount ?? 0,
  };
}

export async function getRepository(
  owner: string,
  name: string,
): Promise<RepositoryDetail | null> {
  const { data } = await getClient().query<GetRepositoryResponse>({
    query: GET_REPOSITORY,
    variables: { owner, name },
  });

  return data?.repository ?? null;
}
