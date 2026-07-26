import { describe, it, expect } from "vitest";
import { formatPrice, formatLargeNumber, formatPercent } from "../utils/formatters";

describe("formatPrice", () => {
  it("returns $0.00 for null", () => {
    expect(formatPrice(null)).toBe("$0.00");
  });

  it("returns $0.00 for undefined", () => {
    expect(formatPrice(undefined)).toBe("$0.00");
  });

  it("returns $0.00 for NaN", () => {
    expect(formatPrice(NaN)).toBe("$0.00");
  });

  it("formats a large price with 2 decimal places", () => {
    expect(formatPrice(65000)).toBe("$65,000.00");
  });

  it("formats a mid-range price correctly", () => {
    expect(formatPrice(1.5)).toBe("$1.50");
  });

  it("formats a sub-dollar price with 6 decimal places", () => {
    expect(formatPrice(0.000123)).toBe("$0.000123");
  });
});

describe("formatLargeNumber", () => {
  it("returns $0 for null", () => {
    expect(formatLargeNumber(null)).toBe("$0");
  });

  it("formats trillions", () => {
    expect(formatLargeNumber(1_200_000_000_000)).toBe("$1.20T");
  });

  it("formats billions", () => {
    expect(formatLargeNumber(1_500_000_000)).toBe("$1.50B");
  });

  it("formats millions", () => {
    expect(formatLargeNumber(3_500_000)).toBe("$3.50M");
  });

  it("formats thousands", () => {
    expect(formatLargeNumber(8_500)).toBe("$8.50K");
  });

  it("formats sub-thousand values", () => {
    expect(formatLargeNumber(99)).toBe("$99.00");
  });
});

describe("formatPercent", () => {
  it("returns 0.00% for null", () => {
    expect(formatPercent(null)).toBe("0.00%");
  });

  it("prefixes positive values with +", () => {
    expect(formatPercent(5.25)).toBe("+5.25%");
  });

  it("does not add + for negative values", () => {
    expect(formatPercent(-3.14)).toBe("-3.14%");
  });

  it("handles zero correctly", () => {
    expect(formatPercent(0)).toBe("+0.00%");
  });
});
