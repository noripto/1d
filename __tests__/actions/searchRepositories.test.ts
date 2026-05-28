import { beforeEach, describe, expect, it, vi } from "vitest";

const mockQuery = vi.fn();
vi.mock("@/lib/api/client", () => ({
  getClient: () => ({
    query: mockQuery,
  }),
}));

import {
  getRepository,
  searchRepositories,
} from "@/app/_actions/searchRepositories";

describe("searchRepositories", () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  it("空クエリのとき空の結果を返す", async () => {
    const result = await searchRepositories("");

    expect(result).toEqual({
      repositories: [],
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("空白のみのクエリのとき空の結果を返す", async () => {
    const result = await searchRepositories("   ");

    expect(result).toEqual({
      repositories: [],
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("正しいクエリでGraphQL APIを呼ぶ", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        search: {
          repositoryCount: 1,
          nodes: [
            {
              id: "1",
              name: "react",
              owner: { login: "facebook", avatarUrl: "https://example.com" },
              description: "A JavaScript library",
              stargazerCount: 200000,
              forkCount: 40000,
              primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
              url: "https://github.com/facebook/react",
            },
          ],
        },
      },
    });

    const result = await searchRepositories("react");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { query: "react", first: 30 },
      }),
    );
    expect(result.repositories).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("結果からnullのノードを除外する", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        search: {
          repositoryCount: 2,
          nodes: [
            {
              id: "1",
              name: "valid-repo",
              owner: { login: "user", avatarUrl: "https://example.com" },
              description: null,
              stargazerCount: 100,
              forkCount: 10,
              primaryLanguage: null,
              url: "https://github.com/user/valid-repo",
            },
            null,
          ],
        },
      },
    });

    const result = await searchRepositories("test");

    expect(result.repositories).toHaveLength(1);
    expect(result.repositories[0].name).toBe("valid-repo");
  });
});

describe("getRepository", () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  it("モックデータを返す", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        repository: {
          id: "1",
          name: "react",
          owner: { login: "facebook", avatarUrl: "https://example.com" },
          description: "A JavaScript library",
          url: "https://github.com/facebook/react",
          stargazerCount: 200000,
          forkCount: 40000,
          primaryLanguage: { name: "JavaScript", color: "#f1e05a" },
          watchers: { totalCount: 6000 },
          issues: { totalCount: 500 },
          createdAt: "2013-05-24T16:15:54Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    });

    const result = await getRepository("facebook", "react");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { owner: "facebook", name: "react" },
      }),
    );
    expect(result?.name).toBe("react");
    expect(result?.stargazerCount).toBe(200000);
  });

  it("リポジトリが見つからないときnullを返す", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        repository: null,
      },
    });

    const result = await getRepository("nonexistent", "repo");

    expect(result).toBeNull();
  });
});
