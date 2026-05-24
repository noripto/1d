"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { searchRepositories } from "@/app/_actions/searchRepositories";
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
  const [repositories, setRepositories] =
    useState<RepositorySearchItem[]>(initialRepositories);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await searchRepositories(query, pageInfo.endCursor);
      setRepositories((prev) => [...prev, ...result.repositories]);
      setPageInfo(result.pageInfo);
    } finally {
      setIsLoading(false);
    }
  }, [query, pageInfo, isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

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
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
            読み込み中...
          </div>
        )}
        {!pageInfo.hasNextPage && repositories.length > 0 && (
          <p className="text-sm text-zinc-400">すべて表示しました</p>
        )}
      </div>
    </div>
  );
}
