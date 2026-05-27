"use client";

import { useCallback } from "react";
import { searchRepositories } from "@/app/_actions/searchRepositories";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import type { PageInfo, RepositorySearchItem } from "@/lib/types/github";
import { RepositoryCard } from "./RepositoryCard";

type Props = {
  query: string;
  initialRepositories: RepositorySearchItem[];
  initialPageInfo: PageInfo;
  totalCount: number;
};

export function RepositoryListInfinite({
  query,
  initialRepositories,
  initialPageInfo,
  totalCount,
}: Props) {
  const fetcher = useCallback(
    async (cursor: string) => {
      const result = await searchRepositories(query, cursor);
      return { items: result.repositories, pageInfo: result.pageInfo };
    },
    [query],
  );

  const {
    items: repositories,
    isLoading,
    hasNextPage,
    sentinelRef,
  } = useInfiniteScroll({
    initialItems: initialRepositories,
    initialPageInfo,
    fetcher,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        {totalCount.toLocaleString()} 件中 {repositories.length} 件を表示
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>

      <div ref={sentinelRef} className="py-4 flex justify-center">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500" />
            読み込み中...
          </div>
        )}
      </div>
    </div>
  );
}
