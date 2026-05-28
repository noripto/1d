import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getRepository,
  searchRepositories,
} from "@/app/_actions/searchRepositories";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

afterEach(() => mockFetch.mockClear());

function mockJson(data: unknown, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });
}

const rawRepo = {
  id: 1,
  name: "react",
  owner: { login: "facebook", avatar_url: "https://example.com" },
  description: "A JavaScript library",
  stargazers_count: 200000,
  forks_count: 40000,
  language: "JavaScript",
  html_url: "https://github.com/facebook/react",
};

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

  it("正しいクエリでGitHub APIを呼ぶ", async () => {
    mockJson({ total_count: 1, items: [rawRepo] });

    const result = await searchRepositories("react");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("q=react");
    expect(calledUrl).toContain("page=1");
    expect(result.repositories).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("cursorが渡されたとき対応するページを取得する", async () => {
    mockJson({ total_count: 100, items: [rawRepo] });

    const result = await searchRepositories("react", "2");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=2");
    expect(result.pageInfo.hasNextPage).toBe(true);
    expect(result.pageInfo.endCursor).toBe("3");
  });
});

describe("getRepository", () => {
  it("正しい変数でGitHub APIを呼ぶ", async () => {
    mockJson({
      ...rawRepo,
      subscribers_count: 6000,
      open_issues_count: 500,
      created_at: "2013-05-24T16:15:54Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const result = await getRepository("facebook", "react");

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/repos/facebook/react");
    expect(result?.name).toBe("react");
    expect(result?.stargazerCount).toBe(200000);
  });

  it("リポジトリが見つからないときnullを返す", async () => {
    mockJson({}, 404);

    const result = await getRepository("nonexistent", "repo");

    expect(result).toBeNull();
  });
});
