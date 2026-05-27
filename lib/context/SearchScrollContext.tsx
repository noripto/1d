"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { PageInfo, RepositorySearchItem } from "@/lib/types/github";

type CachedState = {
  items: RepositorySearchItem[];
  pageInfo: PageInfo;
};

type SearchScrollContextType = {
  getCachedState: (key: string) => CachedState | undefined;
  setCachedState: (key: string, state: CachedState) => void;
  getScrollY: (key: string) => number | undefined;
  setScrollY: (key: string, y: number) => void;
};

const SearchScrollContext = createContext<SearchScrollContextType | null>(null);

export function SearchScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache, setCache] = useState<Map<string, CachedState>>(new Map());
  const scrollMap = useRef<Map<string, number>>(new Map());

  const getCachedState = useCallback(
    (key: string) => cache.get(key),
    [cache],
  );

  const setCachedState = useCallback((key: string, state: CachedState) => {
    setCache((prev) => new Map(prev).set(key, state));
  }, []);

  const getScrollY = useCallback(
    (key: string) => scrollMap.current.get(key),
    [],
  );

  const setScrollY = useCallback((key: string, y: number) => {
    scrollMap.current.set(key, y);
  }, []);

  return (
    <SearchScrollContext.Provider
      value={{ getCachedState, setCachedState, getScrollY, setScrollY }}
    >
      {children}
    </SearchScrollContext.Provider>
  );
}

export function useSearchScrollContext() {
  const ctx = useContext(SearchScrollContext);
  if (!ctx) throw new Error("SearchScrollProvider is required");
  return ctx;
}
