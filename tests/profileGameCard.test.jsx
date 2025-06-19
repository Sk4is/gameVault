import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileGameCard from "../src/components/ProfileGameCard/ProfileGameCard";

describe("ProfileGameCard", () => {
  const baseGame = {
    title: "Test Game",
    image: "https://example.com/game.jpg",
    last_connection: "2023-06-15T12:30:00Z",
    hours_played: 12.3456,
  };

  it("renders game title and image", () => {
    render(<ProfileGameCard game={baseGame} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", baseGame.image);
    expect(screen.getByRole("img")).toHaveAttribute("alt", baseGame.title);
    expect(screen.getByText(baseGame.title)).toBeInTheDocument();
  });

  it("formats and shows last connection date correctly", () => {
    render(<ProfileGameCard game={baseGame} />);
    expect(screen.getByText(/Last connection:/i)).toBeInTheDocument();
    expect(screen.getByText(/15 jun/i)).toBeInTheDocument();
  });

  it('shows "Don\'t played yet" if no last_connection provided', () => {
    render(<ProfileGameCard game={{ ...baseGame, last_connection: null }} />);
    expect(
      screen.getByText(/Last connection: Don't played yet/i)
    ).toBeInTheDocument();
  });

  it('shows "Fecha no válida" if last_connection is invalid date', () => {
    render(
      <ProfileGameCard
        game={{ ...baseGame, last_connection: "invalid-date" }}
      />
    );
    expect(
      screen.getByText(/Last connection: Fecha no válida/i)
    ).toBeInTheDocument();
  });

  it("formats and shows hours played with two decimals", () => {
    render(<ProfileGameCard game={baseGame} />);
    expect(screen.getByText("12.35 h")).toBeInTheDocument();
  });
});
