import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RepositoryCard } from "@/app/_components/RepositoryCard";
import type { RepositorySearchItem } from "@/lib/types/github";

const mockRepository: RepositorySearchItem = {
  id: "1",
  name: "test-repo",
  owner: {
    login: "test-user",
    avatarUrl: "https://example.com/avatar.png",
  },
  description: "This is a test repository",
  stargazerCount: 1234,
  forkCount: 567,
  primaryLanguage: {
    name: "TypeScript",
    color: "#3178c6",
  },
  url: "https://github.com/test-user/test-repo",
};

describe("RepositoryCard", () => {
  it("リポジトリ名を表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText("test-user/")).toBeInTheDocument();
    expect(screen.getByText("test-repo")).toBeInTheDocument();
  });

  it("リポジトリの説明を表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText("This is a test repository")).toBeInTheDocument();
  });

  it("スター数を表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("フォーク数を表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText("567")).toBeInTheDocument();
  });

  it("主要言語を表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("リポジトリ詳細ページへのリンクを表示する", () => {
    render(<RepositoryCard repository={mockRepository} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/repositories/test-user/test-repo");
  });

  it("説明がないとき説明を表示しない", () => {
    const repoWithoutDescription = { ...mockRepository, description: null };
    render(<RepositoryCard repository={repoWithoutDescription} />);

    expect(
      screen.queryByText("This is a test repository"),
    ).not.toBeInTheDocument();
  });

  it("言語情報がないとき言語を表示しない", () => {
    const repoWithoutLanguage = { ...mockRepository, primaryLanguage: null };
    render(<RepositoryCard repository={repoWithoutLanguage} />);

    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });
});
