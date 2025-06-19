import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameCarousel from "../src/components/NewGames/NewGames";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("GameCarousel - NewGames", () => {
  const gamesMock = [
    {
      id: 1,
      name: "Game 1",
      cover: { url: "http://example.com/t_thumb/game1.jpg" },
      genres: [{ name: "Action" }, { name: "Adventure" }],
      summary: "This is a great game.",
      platforms: [{ abbreviation: "PC" }],
      rating: 80,
      first_release_date: 1609459200,
    },
    {
      id: 2,
      name: "Game 2",
      cover: { url: "http://example.com/t_thumb/game2.jpg" },
      genres: [],
      summary: null,
      platforms: [],
      rating: null,
      first_release_date: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fallback text when data is missing", async () => {
    axios.get.mockResolvedValueOnce({ data: gamesMock });

    render(
      <MemoryRouter>
        <GameCarousel />
      </MemoryRouter>
    );

    const unknowns = await screen.findAllByText(/unknown/i);
    expect(unknowns.length).toBeGreaterThan(0);

    const notAvailables = await screen.findAllByText(/not available/i);
    expect(notAvailables.length).toBeGreaterThan(0);
  });
});
