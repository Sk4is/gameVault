import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../src/components/Footer/Footer";

it("renders current year and GameVault text", () => {
  render(<Footer />);
  const year = new Date().getFullYear();
  expect(screen.getByText(`© ${year} GameVault`)).toBeInTheDocument();
});

it("renders GitHub link with correct href and attributes", () => {
  render(<Footer />);
  const link = screen.getByRole("link", {
    name: /view source code on github/i,
  });

  expect(link).toHaveAttribute(
    "href",
    expect.stringContaining("github.com/Sk4is/gameVault")
  );
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

it("renders GitHub image with alt text", () => {
  render(<Footer />);
  const img = screen.getByAltText("GitHub Logo");
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute("src", expect.stringContaining("cloudinary"));
});
