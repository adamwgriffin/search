import { objectsValuesEqual } from "./index";

describe("objectsValuesEqual", () => {
  const obj1 = { a: 1, b: { c: 2 }, d: 3 };
  const obj2 = { a: 1, b: { c: 2 }, d: 6 };

  it("should return true if all specified attributes are equal in both objects", () => {
    expect(objectsValuesEqual(obj1, obj2, ["a", "b.c"])).toBe(true);
  });

  it("should return false if any specified attributes are not equal in both objects", () => {
    expect(objectsValuesEqual(obj1, obj2, ["a", "b.c", "d"])).toBe(false);
  });
});
