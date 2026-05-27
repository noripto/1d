"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PageInfo } from "@/lib/types/github";

type Options<T> = {
  initialItems: T[];
  initialPageInfo: PageInfo;
  fetcher: (cursor: string) => Promise<{ items: T[]; pageInfo: PageInfo }>;
};

type Result<T> = {
  items: T[];
  isLoading: boolean;
  hasNextPage: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
};

export function useInfiniteScroll<T>({
  initialItems,
  initialPageInfo,
  fetcher,
}: Options<T>): Result<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await fetcher(pageInfo.endCursor);
      setItems((prev) => [...prev, ...result.items]);
      setPageInfo(result.pageInfo);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, pageInfo, isLoading]);

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

  return { items, isLoading, hasNextPage: pageInfo.hasNextPage, sentinelRef };
}
