import { render, screen, cleanup } from "@testing-library/react";
import AchievementIcon, {
  iconMap,
} from "../src/components/AchievementIcon/AchievementIcon";

describe("AchievementIcon", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the correct icon for each id", () => {
    Object.entries(iconMap).forEach(([id, icon]) => {
      render(<AchievementIcon id={Number(id)} />);
      expect(screen.getByRole("img")).toHaveTextContent(icon);
      cleanup();
    });
  });

  it("renders default icon if id not in iconMap", () => {
    render(<AchievementIcon id={999} />);
    expect(screen.getByRole("img")).toHaveTextContent("⭐");
  });

  it("applies alt and className props", () => {
    render(<AchievementIcon id={1} alt="My Alt" className="my-class" />);
    const icon = screen.getByRole("img", { name: /my alt/i });
    expect(icon).toHaveClass("achievement-icon my-class");
  });
});
