import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Review from "../src/components/Reviews/Reviews";
import axios from "axios";
import Swal from "sweetalert2";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
}));

vi.mock("axios");

vi.mock("sweetalert2", () => ({
  fire: vi.fn(),
}));

const fakeTokenPayload = {
  id: 1,
  role: "user",
};
const fakeToken = `header.${btoa(JSON.stringify(fakeTokenPayload))}.signature`;

beforeEach(() => {
  localStorage.setItem("token", fakeToken);
  vi.clearAllMocks();
});

describe("Review component", () => {
  it("renders reviews and game name", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/api/reviews/")) {
        return Promise.resolve({
          data: [
            {
              user_id: 1,
              username: "Tester",
              rating: 4,
              content: "Great game!",
              published_date: "2023-01-01T12:00:00Z",
            },
          ],
        });
      }
      if (url.includes("/api/game-name/")) {
        return Promise.resolve({ data: { name: "Cool Game" } });
      }
      return Promise.resolve({ data: [] });
    });

    render(<Review />);

    await waitFor(() => {
      expect(screen.getByText("Tester")).toBeInTheDocument();
      expect(screen.getByText("Great game!")).toBeInTheDocument();
      expect(screen.getByText(/Posted:/)).toBeInTheDocument();
    });
  });
});
