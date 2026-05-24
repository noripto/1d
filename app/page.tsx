import { Suspense } from "react";
import { SearchForm } from "./_components/SearchForm";
import { RepositoryList } from "./_components/RepositoryList";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-zinc-950 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">GitHub Repository Search</h1>
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {q ? (
          <Suspense
            fallback={
              <div className="text-center py-12 text-zinc-500">
                検索中...
              </div>
            }
          >
            <RepositoryList query={q} />
          </Suspense>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            <p>キーワードを入力してリポジトリを検索してください</p>
          </div>
        )}
      </main>
    </div>
  );
}
