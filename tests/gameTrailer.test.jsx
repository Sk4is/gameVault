import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RandomGameCard from "../src/components/GameTrailer/GameTrailer";
import axios from "axios";
import Swal from "sweetalert2";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("sweetalert2");

describe("RandomGameCard", () => {
  const gameMock = {
    id: 123,
    name: "Test Game",
    videos: [{ video_id: "abc123" }],
    cover: { url: "http://example.com/t_thumb/game.jpg" },
    genres: [{ name: "Action" }],
    summary: "Great game summary",
    rating: 80,
    first_release_date: 1609459200,
    platforms: [{ abbreviation: "PC" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    axios.get.mockResolvedValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <RandomGameCard />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("handles add to library with no token", async () => {
    axios.get.mockResolvedValue({ data: [gameMock] });
    vi.spyOn(localStorage, "getItem").mockReturnValue(null);

    render(
      <MemoryRouter>
        <RandomGameCard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Test Game"));

    fireEvent.click(screen.getByText(/add to library/i));
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error",
      "You must be logged in",
      "error"
    );
  });
});
