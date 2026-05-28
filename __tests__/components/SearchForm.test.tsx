import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchForm } from "@/app/_components/SearchForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

describe("SearchForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("検索入力とボタン表示", () => {
    render(<SearchForm />);

    expect(
      screen.getByPlaceholderText("リポジトリを検索..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /検索/ })).toBeInTheDocument();
  });

  it("入力時にinput値更新", () => {
    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    fireEvent.change(input, { target: { value: "react" } });

    expect(input).toHaveValue("react");
  });

  it("入力が空のときボタンdisabled", () => {
    render(<SearchForm />);

    const button = screen.getByRole("button", { name: /検索/ });
    expect(button).toBeDisabled();
  });

  it("入力に値があるときボタン有効", () => {
    render(<SearchForm />);

    const input = screen.getByPlaceholderText("リポジトリを検索...");
    fireEvent.change(input, { target: { value: "react" } });

    const button = screen.getByRole("button", { name: /検索/ });
    expect(button).not.toBeDisabled();
  });
});
