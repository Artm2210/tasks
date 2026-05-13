import { describe, expect, it } from "vitest";

import { sum } from "../src";

describe("Tests for sum function", () => {
  it("should sum a and b", () => {
    expect(sum(2, 3)).toBe(5);
  });
  it("should sum negative numbers", () => {
    expect(sum(-1, -2)).toBe(-3);
  });
  it("should sum decimal numbers", () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3, 10);
  });
});
