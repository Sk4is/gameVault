import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameInfoPage from "../src/components/GameInfo/GameInfo";
import axios from "axios";
import Swal from "sweetalert2";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("axios");

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

const renderWithRouter = (ui, { route = "/game/123" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/game/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("GameInfoPage", () => {
  const mockGameData = {
    id: 123,
    name: "Test Game",
    summary: "Game summary here",
    platforms: [{ abbreviation: "PC" }, { abbreviation: "PS5" }],
    first_release_date: 1609459200,
    screenshots: [
      { id: 1, url: "https://example.com/t_thumb/screenshot1.jpg" },
      { id: 2, url: "https://example.com/t_thumb/screenshot2.jpg" },
    ],
    genres: [{ name: "Action" }],
    cover: { url: "https://example.com/t_thumb/cover.jpg" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading initially", () => {
    axios.get.mockResolvedValueOnce({ data: mockGameData });
    renderWithRouter(<GameInfoPage />);
    expect(screen.getByText(/Loading game details/i)).toBeInTheDocument();
  });

  test("fetches and displays game info", async () => {
    axios.get.mockResolvedValueOnce({ data: mockGameData });
    renderWithRouter(<GameInfoPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Game")).toBeInTheDocument();
      expect(screen.getByText(/Game summary here/i)).toBeInTheDocument();
      expect(screen.getByText(/PC, PS5/i)).toBeInTheDocument();
      expect(screen.getByText("2021")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add to Library/i })
      ).toBeInTheDocument();
    });
  });

  test("shows no screenshots message if none available", async () => {
    axios.get.mockResolvedValueOnce({
      data: { ...mockGameData, screenshots: [] },
    });
    renderWithRouter(<GameInfoPage />);

    await waitFor(() => {
      expect(screen.getByText(/No screenshots available/i)).toBeInTheDocument();
    });
  });

  test("opens and closes zoom on screenshot click", async () => {
    axios.get.mockResolvedValueOnce({ data: mockGameData });

    renderWithRouter(<GameInfoPage />);

    await waitFor(() => screen.getByText("Test Game"));

    const screenshotImages = screen.getAllByAltText("Screenshot");
    fireEvent.click(screenshotImages[0]);

    expect(screen.getByAltText("Zoomed")).toBeInTheDocument();

    fireEvent.click(screen.getByText("X"));

    await waitFor(() => {
      expect(screen.queryByAltText("Zoomed")).not.toBeInTheDocument();
    });
  });
});
