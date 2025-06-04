import { formatLotSize } from "./listing_helpers";

describe("formatLotSize", () => {
  it("formats lot size in square feet", () => {
    expect(formatLotSize(5000)).toBe("5,000 sqft");
  });

  it("formats lot size in acres for large values", () => {
    expect(formatLotSize(43560)).toBe("1.00 acre");
    expect(formatLotSize(87120)).toBe("2.00 acres");
  });

  it("handles zero correctly", () => {
    expect(formatLotSize(0)).toBe("0 sqft");
  });
});
