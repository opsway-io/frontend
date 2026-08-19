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

  it("should humanize seconds correctly", () => {
    expect(secondsHumanize(1)).toBe("1 second");
    expect(secondsHumanize(60)).toBe("1 minute");
    expect(secondsHumanize(3600)).toBe("1 hour");
  });
});
