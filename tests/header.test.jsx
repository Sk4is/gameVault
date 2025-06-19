import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../src/components/Header/Header";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderHeader = () => {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

it("renders logo and menu button", () => {
  renderHeader();

  expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
});

it("navigates to /landing when clicking Home", async () => {
  renderHeader();

  fireEvent.click(screen.getByLabelText(/open menu/i));
  const homeLink = await screen.findByText(/home/i);
  fireEvent.click(homeLink);

  expect(mockNavigate).toHaveBeenCalledWith("/landing");
});

it("navigates to /library when clicking Library", async () => {
  renderHeader();

  fireEvent.click(screen.getByLabelText(/open menu/i));
  const libraryLink = await screen.findByText(/library/i);
  fireEvent.click(libraryLink);

  expect(mockNavigate).toHaveBeenCalledWith("/library");
});

it("navigates to /profile when clicking Profile", async () => {
  renderHeader();

  fireEvent.click(screen.getByLabelText(/open menu/i));
  const profileLink = await screen.findByText(/profile/i);
  fireEvent.click(profileLink);

  expect(mockNavigate).toHaveBeenCalledWith("/profile");
});

it("navigates to /settings when clicking settings icon", async () => {
  renderHeader();

  fireEvent.click(screen.getByLabelText(/open menu/i));
  const settingsBtn = await screen.findByRole("button", { name: /settings/i });
  fireEvent.click(settingsBtn);

  expect(mockNavigate).toHaveBeenCalledWith("/settings");
});
