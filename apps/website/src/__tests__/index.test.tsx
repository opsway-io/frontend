import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Route } from "../routes/index.lazy";

const Home = Route.options.component!;

describe("Home Page (Website)", () => {
  it("renders the hero section correctly", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
