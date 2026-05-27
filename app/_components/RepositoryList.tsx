import { searchRepositories } from "@/app/_actions/searchRepositories";
import { RepositoryListInfinite } from "./RepositoryListInfinite";

type Props = {
  query: string;
};

export async function RepositoryList({ query }: Props) {
  const { repositories, totalCount, pageInfo } =
    await searchRepositories(query);

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <p>リポジトリが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <RepositoryListInfinite
      key={query}
      query={query}
      initialRepositories={repositories}
      initialPageInfo={pageInfo}
      totalCount={totalCount}
    />
  );
}
