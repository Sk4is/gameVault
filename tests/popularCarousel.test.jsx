import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import GameCarousel from "../src/components/PopularGameCarousel/PopularGameCarousel";

vi.mock("axios");

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

it("renders loading message initially", () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  renderWithRouter(<GameCarousel />);
  expect(screen.getByText(/Featured Games/i)).toBeInTheDocument();
  expect(screen.getByText(/Loading games/i)).toBeInTheDocument();
});

it("renders game cards after loading", async () => {
  const mockGames = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      cover: { url: "https://example.com/cyberpunk.jpg" },
      genres: [{ name: "RPG" }],
      summary: "Futuristic RPG.",
      platforms: [{ abbreviation: "PC" }],
      rating: 85,
      first_release_date: 1609459200,
    },
  ];

  axios.get.mockResolvedValueOnce({ data: mockGames });

  renderWithRouter(<GameCarousel />);

  await waitFor(() => {
    expect(screen.getAllByText("Cyberpunk 2077").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Futuristic RPG/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Genres:\s*RPG/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Platforms:\s*PC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2021/).length).toBeGreaterThan(0);
  });
});

it("renders multiple game cards if more than one is returned", async () => {
  const mockGames = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      cover: { url: "https://example.com/cyberpunk.jpg" },
      genres: [{ name: "RPG" }],
      summary: "Futuristic RPG.",
      platforms: [{ abbreviation: "PC" }],
      rating: 85,
      first_release_date: 1609459200,
    },
    {
      id: 2,
      name: "The Witcher 3",
      cover: { url: "https://example.com/witcher.jpg" },
      genres: [{ name: "Action" }],
      summary: "Monster hunting epic.",
      platforms: [{ abbreviation: "PS4" }],
      rating: 90,
      first_release_date: 1430438400,
    },
  ];

  axios.get.mockResolvedValueOnce({ data: mockGames });

  renderWithRouter(<GameCarousel />);

  await waitFor(() => {
    expect(screen.getAllByText("Cyberpunk 2077").length).toBeGreaterThan(0);
    expect(screen.getAllByText("The Witcher 3").length).toBeGreaterThan(0);
  });
});

it("hides loading message after games are loaded", async () => {
  const mockGames = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      cover: { url: "https://example.com/cyberpunk.jpg" },
      genres: [{ name: "RPG" }],
      summary: "Futuristic RPG.",
      platforms: [{ abbreviation: "PC" }],
      rating: 85,
      first_release_date: 1609459200,
    },
  ];

  axios.get.mockResolvedValueOnce({ data: mockGames });

  renderWithRouter(<GameCarousel />);

  await waitFor(() => {
    expect(screen.queryByText(/Loading games/i)).not.toBeInTheDocument();
  });
});
