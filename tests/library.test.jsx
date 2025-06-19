import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Library from "../src/components/Library/Library";
import Swal from "sweetalert2";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

const mockGames = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Game ${i + 1}`,
}));

const mockAchievements = [
  { id: 1, name: "Some Achievement" },
  { id: 2, name: "Another Achievement" },
];

describe("Library component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
    vi.clearAllMocks();
  });

  it("renders without crashing and shows header", () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>
    );
    expect(screen.getByText(/My Library/i)).toBeInTheDocument();
  });

  it("renders game cards when games are returned", async () => {
    axios.get.mockResolvedValueOnce({ data: mockGames });
    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText(/Game \d+/i).length).toBe(mockGames.length);
    });
  });

  it("unlocks achievement when 10 or more games and achievement not unlocked", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockGames })
      .mockResolvedValueOnce({ data: mockAchievements });

    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Achievement unlocked!",
          text: expect.stringContaining("Collector"),
        })
      );
    });
  });

  it("does not unlock achievement if already unlocked", async () => {
    const achievementsWith3 = [
      ...mockAchievements,
      { id: 3, name: "Collector" },
    ];

    axios.get
      .mockResolvedValueOnce({ data: mockGames })
      .mockResolvedValueOnce({ data: achievementsWith3 });

    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(Swal.fire).not.toHaveBeenCalled();
    });
  });

  it("logs error if fetching fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    axios.get.mockRejectedValueOnce(new Error("API error"));

    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "❌ Error checking/unlocking achievement:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
