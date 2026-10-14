import { describe, it, expect } from "vitest";
import { millisecondsHumanize, secondsHumanize } from "./time";

describe("time utilities", () => {
  it("should humanize milliseconds correctly", () => {
    expect(millisecondsHumanize(1000)).toBe("1 second");
    expect(millisecondsHumanize(2000)).toBe("2 seconds");
    expect(millisecondsHumanize(60000)).toBe("1 minute");
    expect(millisecondsHumanize(120000)).toBe("2 minutes");
    expect(millisecondsHumanize(3600000)).toBe("1 hour");
    expect(millisecondsHumanize(7200000)).toBe("2 hours");
  });

  it("should handle edge cases in millisecondsHumanize", () => {
    expect(millisecondsHumanize(0)).toBe("0 seconds");
    expect(millisecondsHumanize(-100)).toBe("0 seconds");
    expect(millisecondsHumanize(NaN)).toBe("0 seconds");
  });

  it("should humanize seconds correctly", () => {
    expect(secondsHumanize(1)).toBe("1 second");
    expect(secondsHumanize(60)).toBe("1 minute");
    expect(secondsHumanize(3600)).toBe("1 hour");
  });

  it("should handle edge cases and legacy nanoseconds in secondsHumanize", () => {
    expect(secondsHumanize(0)).toBe("0 seconds");
    expect(secondsHumanize(-50)).toBe("0 seconds");
    expect(secondsHumanize(NaN)).toBe("0 seconds");
    // Legacy nanoseconds (60 billion ns -> 60 seconds -> 1 minute)
    expect(secondsHumanize(60000000000)).toBe("1 minute");
  });
});
