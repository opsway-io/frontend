import { describe, it, expect } from "vitest";
import { DarkTheme } from "./dark";

describe("Dark Theme", () => {
  it("should have a valid palette", () => {
    expect(DarkTheme.palette).toBeDefined();
    expect(DarkTheme.palette.mode).toBe("dark");
  });
});
