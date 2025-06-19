import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LibraryGameCard from "../src/components/GameLibraryCard/GameLibraryCard";
import axios from "axios";
import Swal from "sweetalert2";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("sweetalert2", async () => {
  const actual = await vi.importActual("sweetalert2");
  return {
    ...actual,
    default: {
      ...actual.default,
      fire: vi.fn(),
    },
  };
});

describe("LibraryGameCard", () => {
  const gameMock = {
    id: 1,
    title: "Test Game",
    image: "http://example.com/game.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders game info", () => {
    render(
      <MemoryRouter>
        <LibraryGameCard game={gameMock} />
      </MemoryRouter>
    );
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      gameMock.image
    );
  });

  it("shows overlay when Play button is clicked", () => {
    render(
      <MemoryRouter>
        <LibraryGameCard game={gameMock} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Play"));
    expect(screen.getByText(/Simulating game: Test Game/i)).toBeInTheDocument();
  });

  it("calls API and Swal on Close Game", async () => {
    axios.post.mockResolvedValueOnce({});
    axios.post.mockResolvedValueOnce({ data: { unlocked: true } });
    Swal.fire.mockResolvedValue();

    render(
      <MemoryRouter>
        <LibraryGameCard game={gameMock} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Play"));
    fireEvent.click(screen.getByText("Close Game"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/update-playtime"),
        expect.objectContaining({ gameId: gameMock.id }),
        expect.any(Object)
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Achievement unlocked!" })
      );
    });
  });

  it("calls navigate on Game Info button click", () => {
    render(
      <MemoryRouter>
        <LibraryGameCard game={gameMock} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Game Info"));
    expect(mockNavigate).toHaveBeenCalledWith(`/gameinfo/${gameMock.id}`);
  });
});
