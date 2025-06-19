import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import Profile from "../src/components/Profile/Profile";
import { ThemeContext } from "../src/components/Contexts/ThemeContext";
import Swal from "sweetalert2";

vi.mock("axios");

vi.mock("sweetalert2", () => ({
  __esModule: true,
  default: {
    fire: vi.fn(),
  },
}));

const mockContextValue = { darkMode: false };

const renderWithProviders = () => {
  return render(
    <ThemeContext.Provider value={mockContextValue}>
      <Profile />
    </ThemeContext.Provider>
  );
};

beforeEach(() => {
  localStorage.setItem("token", "mock-token");
  vi.clearAllMocks();
});

it("renders with default user data", async () => {
  axios.get.mockResolvedValueOnce({ data: { name: "TestUser", avatar: "" } });
  axios.get.mockResolvedValueOnce({ data: [] });
  axios.get.mockResolvedValueOnce({ data: [] });

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    const img = screen.getByAltText(/profile picture/i);
    expect(img).toHaveAttribute("src", expect.stringContaining("avatar.png"));
  });
});

it("renders recent games if available", async () => {
  axios.get.mockResolvedValueOnce({ data: { name: "Player", avatar: "" } });
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, name: "Game A", hours_played: 5, last_connection: "2023-01-01" },
    ],
  });
  axios.get.mockResolvedValueOnce({ data: [] });

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText(/Recently Played Games/i)).toBeInTheDocument();
  });
});

it("shows unlocked achievements and triggers modal on click", async () => {
  axios.get.mockResolvedValueOnce({ data: { name: "Player", avatar: "" } });
  axios.get.mockResolvedValueOnce({ data: [] });
  axios.get.mockResolvedValueOnce({
    data: [
      {
        id: 1,
        name: "Achiever",
        description: "Did a thing.",
        unlocked_at: "2024-01-01",
      },
      {
        id: 5,
        name: "Personal Renewal 🌱",
        description: "You visited your profile!",
        unlocked_at: "2024-01-02",
      },
      {
        id: 9,
        name: "Explorer",
        description: "You explored the app.",
        unlocked_at: "2024-01-03",
      },
      {
        id: 12,
        name: "Veteran",
        description: "Long-time user.",
        unlocked_at: "2024-01-04",
      },
    ],
  });

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText(/Unlocked Achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/View All Achievements/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/View All Achievements/i));
  expect(Swal.fire).toHaveBeenCalledWith(
    expect.objectContaining({ title: "All Achievements" })
  );
});

it("unlocks achievement with ID 5 if not already unlocked", async () => {
  axios.get.mockResolvedValueOnce({ data: { name: "Player", avatar: "" } });
  axios.get.mockResolvedValueOnce({ data: [] });
  axios.get
    .mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "Achiever",
          description: "Did a thing.",
          unlocked_at: "2024-01-01",
        },
      ],
    })
    .mockResolvedValueOnce({});
  axios.get.mockResolvedValueOnce({ data: [] });

  renderWithProviders();

  await waitFor(() => {
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Achievement unlocked!",
        text: expect.stringContaining("Personal Renewal"),
      })
    );
  });
});
