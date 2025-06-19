import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ThemeProvider,
  ThemeContext,
} from "../src/components/Contexts/ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
  });

  it("loads darkMode from localStorage or defaults to true", () => {
    const TestComponent = () => {
      const { darkMode } = useContext(ThemeContext);
      return <div>{darkMode ? "Dark" : "Light"}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("applies correct body classes when darkMode changes", () => {
    let toggleFn;
    const TestComponent = () => {
      const { darkMode, toggleDarkMode } = useContext(ThemeContext);
      toggleFn = toggleDarkMode;
      return <div>{darkMode ? "Dark" : "Light"}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.body.classList.contains("dark-mode")).toBe(true);
    expect(document.body.classList.contains("light-mode")).toBe(false);

    act(() => {
      toggleFn();
    });

    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(document.body.classList.contains("light-mode")).toBe(true);
  });

  it("toggleDarkMode updates localStorage and darkMode state", () => {
    localStorage.setItem("darkMode", JSON.stringify(true));

    let toggleFn;
    const TestComponent = () => {
      const { darkMode, toggleDarkMode } = useContext(ThemeContext);
      toggleFn = toggleDarkMode;
      return <div>{darkMode ? "Dark" : "Light"}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(JSON.parse(localStorage.getItem("darkMode"))).toBe(true);

    act(() => {
      toggleFn();
    });

    expect(JSON.parse(localStorage.getItem("darkMode"))).toBe(false);
    expect(screen.getByText("Light")).toBeInTheDocument();
  });
});
