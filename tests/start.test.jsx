import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Start from "../src/components/Start/Start";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Start component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders all main elements", () => {
    render(
      <MemoryRouter>
        <Start />
      </MemoryRouter>
    );

    expect(screen.getByAltText(/GameVault Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Library/i)).toBeInTheDocument();
    expect(screen.getByText(/Join now/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("redirects to register when Sign Up button is clicked", () => {
    render(
      <MemoryRouter>
        <Start />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("redirects to login when Log In button is clicked", () => {
    render(
      <MemoryRouter>
        <Start />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
