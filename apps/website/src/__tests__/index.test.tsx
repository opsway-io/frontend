import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Index as Home } from "../routes/index.lazy";

describe("Home Page (Website)", () => {
  it("renders the hero section correctly", () => {
    render(<Home />);
    
    expect(screen.getByText(/Open Source Operations/i)).toBeInTheDocument();
  });
});
