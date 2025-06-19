import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../src/components/Login/Login";
import axios from "axios";
import Swal from "sweetalert2";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("sweetalert2");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders form inputs and buttons", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByText(/don't have an account\? sign up/i)
    ).toBeInTheDocument();
  });

  it("shows error if password is invalid", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it("shows Swal error and clears token on failed login", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error",
          text: "Invalid email, password, or user.",
        })
      );
    });

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("toggles password visibility when toggle clicked", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggle = screen.getByText(/🙈|👁️/i);

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe("password");
  });

  it("navigates to register page when signup link clicked", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
