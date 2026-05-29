import { Suspense } from "react";
import { RepositoryList } from "./_components/RepositoryList";
import { SearchForm } from "./_components/SearchForm";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
        {q ? (
          <Suspense
            fallback={
              <div className="text-center py-16 text-zinc-400">検索中...</div>
            }
          >
            <RepositoryList query={q} />
          </Suspense>
        ) : (
          <div className="text-center py-16 text-zinc-400">
            <p>キーワードを入力してリポジトリを検索してください</p>
          </div>
        )}
      </main>
    </div>
  );
}
