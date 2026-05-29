import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getRepository,
  searchRepositories,
} from "@/app/_actions/searchRepositories";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockClear();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("searchRepositories", () => {
  it("空クエリのとき空の結果を返す", async () => {
    const result = await searchRepositories("");

    expect(result).toEqual({
      repositories: [],
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("空白のみのクエリのとき空の結果を返す", async () => {
    const result = await searchRepositories("   ");

    expect(result).toEqual({
      repositories: [],
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("正しいURLでAPIを呼ぶ", async () => {
    mockFetch.mockReturnValueOnce(
      jsonResponse({
        total_count: 1,
        items: [
          {
            id: 1,
            name: "react",
            owner: { login: "facebook", avatar_url: "https://example.com" },
            description: "A JavaScript library",
            stargazers_count: 200000,
            forks_count: 40000,
            language: "JavaScript",
            html_url: "https://github.com/facebook/react",
          },
        ],
      }),
    );

    const result = await searchRepositories("react");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("q=react"),
      expect.any(Object),
    );
    expect(result.repositories).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("レスポンスのフィールドを正しくマッピングする", async () => {
    mockFetch.mockReturnValueOnce(
      jsonResponse({
        total_count: 1,
        items: [
          {
            id: 123,
            name: "valid-repo",
            owner: { login: "user", avatar_url: "https://example.com" },
            description: null,
            stargazers_count: 100,
            forks_count: 10,
            language: null,
            html_url: "https://github.com/user/valid-repo",
          },
        ],
      }),
    );

    const result = await searchRepositories("test");

    expect(result.repositories).toHaveLength(1);
    expect(result.repositories[0]).toEqual({
      id: "123",
      name: "valid-repo",
      owner: { login: "user", avatarUrl: "https://example.com" },
      description: null,
      stargazerCount: 100,
      forkCount: 10,
      primaryLanguage: null,
      url: "https://github.com/user/valid-repo",
    });
  });
});

describe("getRepository", () => {
  it("モックデータを返す", async () => {
    mockFetch.mockReturnValueOnce(
      jsonResponse({
        id: 1,
        name: "react",
        owner: { login: "facebook", avatar_url: "https://example.com" },
        description: "A JavaScript library",
        html_url: "https://github.com/facebook/react",
        stargazers_count: 200000,
        forks_count: 40000,
        language: "JavaScript",
        subscribers_count: 6000,
        open_issues_count: 500,
        created_at: "2013-05-24T16:15:54Z",
        updated_at: "2024-01-01T00:00:00Z",
      }),
    );

    const result = await getRepository("facebook", "react");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/repos/facebook/react"),
      expect.any(Object),
    );
    expect(result?.name).toBe("react");
    expect(result?.stargazerCount).toBe(200000);
    expect(result?.watchers.totalCount).toBe(6000);
    expect(result?.issues.totalCount).toBe(500);
  });

  it("リポジトリが見つからないときnullを返す", async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve(new Response(null, { status: 404 })),
    );

    const result = await getRepository("nonexistent", "repo");

    expect(result).toBeNull();
  });
});
