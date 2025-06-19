import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../src/components/Register/Register";
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

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders form inputs and buttons", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/already have an account\? log in/i)
    ).toBeInTheDocument();
  });

  it("shows error if password is invalid", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("shows error if passwords do not match", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Mismatch1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("calls API and handles successful registration", async () => {
    const token = "mock.jwt.token";

    axios.post.mockResolvedValueOnce({ data: { token } });
    Swal.fire.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/register"),
        { name: "John Doe", email: "john@example.com", password: "Valid1!pass" }
      );
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Success!",
          text: "User registered successfully.",
        })
      );
    });

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(token);
      expect(localStorage.getItem("userName")).toBe("John Doe");
      expect(localStorage.getItem("userEmail")).toBe("john@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error on API failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Email already in use" } },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "Valid1!pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error",
          text: "Email already in use",
        })
      );
    });
  });

  it("toggles password visibility", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const togglePassword = screen.getAllByText(/🙈|👁️/i)[0];
    const toggleConfirmPassword = screen.getAllByText(/🙈|👁️/i)[1];

    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    fireEvent.click(togglePassword);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(togglePassword);
    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleConfirmPassword);
    expect(confirmPasswordInput.type).toBe("text");
    fireEvent.click(toggleConfirmPassword);
    expect(confirmPasswordInput.type).toBe("password");
  });

  it("navigates to login page when login link clicked", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/already have an account\? log in/i));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
