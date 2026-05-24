import { searchRepositories } from "@/app/_actions/searchRepositories";
import { RepositoryCard } from "./RepositoryCard";

type Props = {
  query: string;
};

export async function RepositoryList({ query }: Props) {
  const { repositories, totalCount } = await searchRepositories(query);

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p>リポジトリが見つかりませんでした</p>
        <p className="text-sm mt-1">別のキーワードで検索してみてください</p>
      </div>
    );
  }

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
    </div>
  );
}
