"use client";

import { useCallback, useRef, useState } from "react";
import type { PageInfo } from "@/lib/types/github";

type Options<T> = {
  initialItems: T[];
  initialPageInfo: PageInfo;
  fetcher: (cursor: string) => Promise<{ items: T[]; pageInfo: PageInfo }>;
  onStateChange?: (items: T[], pageInfo: PageInfo) => void;
};

type Result<T> = {
  items: T[];
  isLoading: boolean;
  hasNextPage: boolean;
  sentinelRef: (node: HTMLDivElement | null) => (() => void) | undefined;
};

export function useInfiniteScroll<T>({
  initialItems,
  initialPageInfo,
  fetcher,
  onStateChange,
}: Options<T>): Result<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await fetcher(pageInfo.endCursor);
      const newItems = [...items, ...result.items];
      setItems(newItems);
      setPageInfo(result.pageInfo);
      onStateChange?.(newItems, result.pageInfo);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, pageInfo, isLoading, items, onStateChange]);

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current();
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { items, isLoading, hasNextPage: pageInfo.hasNextPage, sentinelRef };
}
