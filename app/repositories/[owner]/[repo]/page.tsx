import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, Eye, CircleDot, ExternalLink } from "lucide-react";
import { getRepository } from "@/app/_actions/searchRepositories";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { Button } from "@/lib/components/ui/button";

type Props = {
  params: Promise<{ owner: string; repo: string }>;
};

export default async function RepositoryDetailPage({ params }: Props) {
  const { owner, repo } = await params;
  const repository = await getRepository(owner, repo);

  if (!repository) {
    notFound();
  }

  const stats = [
    { label: "Stars", value: repository.stargazerCount, icon: Star },
    { label: "Watchers", value: repository.watchers.totalCount, icon: Eye },
    { label: "Forks", value: repository.forkCount, icon: GitFork },
    { label: "Issues", value: repository.issues.totalCount, icon: CircleDot },
  ];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-zinc-950 py-6">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4" />
              検索結果に戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={repository.owner.avatarUrl} alt={repository.owner.login} />
              <AvatarFallback>{repository.owner.login[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">
                <span className="text-zinc-500">{repository.owner.login}/</span>
                {repository.name}
              </CardTitle>
              {repository.description && (
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  {repository.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3">
                {repository.primaryLanguage && (
                  <span className="flex items-center gap-1 text-sm">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: repository.primaryLanguage.color }}
                    />
                    {repository.primaryLanguage.name}
                  </span>
                )}
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHubで開く
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                >
                  <Icon className="h-6 w-6 text-zinc-500 mb-2" />
                  <span className="text-2xl font-bold">{value.toLocaleString()}</span>
                  <span className="text-sm text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
