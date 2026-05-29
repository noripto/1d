"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/lib/components/ui/button";

export function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    // 履歴が無い場合はトップへ
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      <ArrowLeft className="h-4 w-4" />
      検索結果に戻る
    </Button>
  );
}
