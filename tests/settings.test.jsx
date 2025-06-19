import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Settings from "../src/components/Settings/Settings";
import { ThemeContext } from "../src/components/Contexts/ThemeContext";
import Swal from "sweetalert2";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("axios");

vi.mock("sweetalert2", () => ({
  fire: vi.fn(),
}));

const mockContextValue = {
  darkMode: false,
  toggleDarkMode: vi.fn(),
};

const renderWithProviders = () =>
  render(
    <MemoryRouter>
      <ThemeContext.Provider value={mockContextValue}>
        <Settings />
      </ThemeContext.Provider>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.setItem("token", "mock-token");
  localStorage.setItem("username", "MockUser");
  localStorage.setItem("userEmail", "mock@example.com");
  localStorage.setItem("userAvatar", "");
  vi.clearAllMocks();
});

it("renders settings with initial user data", async () => {
  axios.get.mockResolvedValueOnce({
    data: { name: "MockUser", email: "mock@example.com", avatar: "" },
  });

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByDisplayValue("MockUser")).toBeInTheDocument();
    expect(screen.getByDisplayValue("mock@example.com")).toBeInTheDocument();
  });
});
