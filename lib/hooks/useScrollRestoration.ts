"use client";

import { useEffect } from "react";
import { useSearchScrollContext } from "@/lib/context/SearchScrollContext";

export function useScrollRestoration(key: string) {
  const { getScrollY, setScrollY } = useSearchScrollContext();

  useEffect(() => {
    const saved = getScrollY(key);
    if (saved !== undefined) {
      window.scrollTo({ top: saved, behavior: "instant" });
    }
  }, [key, getScrollY]);

  useEffect(() => {
    const handleScroll = () => setScrollY(key, Math.round(window.scrollY));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [key, setScrollY]);
}
