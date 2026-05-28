"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    console.log("handleSubmit", query);
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <Input
        type="text"
        placeholder="リポジトリを検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !query.trim()}>
        <Search className="h-4 w-4" />
        検索
      </Button>
    </form>
  );
}
