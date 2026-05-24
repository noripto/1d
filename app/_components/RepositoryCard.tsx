import Link from "next/link";
import { Star, GitFork } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import type { RepositorySearchItem } from "@/lib/types/github";

type Props = {
  repository: RepositorySearchItem;
};

export function RepositoryCard({ repository }: Props) {
  return (
    <Link href={`/repositories/${repository.owner.login}/${repository.name}`}>
      <Card className="h-full transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={repository.owner.avatarUrl} alt={repository.owner.login} />
            <AvatarFallback>{repository.owner.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-base font-medium">
            <span className="text-zinc-500">{repository.owner.login}/</span>
            {repository.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {repository.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {repository.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            {repository.primaryLanguage && (
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: repository.primaryLanguage.color }}
                />
                {repository.primaryLanguage.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {repository.stargazerCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {repository.forkCount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
