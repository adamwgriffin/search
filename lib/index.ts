import type { PaginationParams } from "../zod_schemas/listingSearchParamsSchema";
import get from "lodash/get";
import { DefaultPageSize } from "../config";

export const objectsValuesEqual = (
  obj1: object,
  obj2: object,
  attrs: string[]
): boolean => {
  return attrs.every((attr) => {
    return get(obj1, attr) === get(obj2, attr);
  });
};

export const getPaginationParams = (
  query: Partial<PaginationParams>
): PaginationParams => {
  return {
    page_size: Number(query.page_size) || DefaultPageSize,
    page_index: Number(query.page_index) || 0
  };
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Similar to `Array.prototype.slice` but can wrap around to the beginning/end of
 * the array.
 *
 * @param start The beginning index of the specified portion of the array. If
 * start is a negative number then it wraps around to the end of the array.
 * @param end The end index of the specified portion of the array. This is
 * exclusive of the element at the index 'end'. If end is a negative number
 * then it wraps around to the beginning of the array.
 *
 * @example
 * const array = [0, 1, 2, 3, 4];
 * sliceWrap(array, -1, 2); // [4, 0, 1]
 */
export const sliceWrap = <T>(arr: T[], start: number, end: number) => {
  const len = arr.length;
  // Adjust indices for wrap-around
  start = start % len;
  if (start < 0) start += len;

  end = end % len;
  if (end < 0) end += len;

  if (start <= end) {
    return arr.slice(start, end);
  } else {
    // Wrap-around case
    return arr.slice(start).concat(arr.slice(0, end));
  }
};

export const elementIsVisible = (
  element: HTMLElement,
  container: HTMLElement
) => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom
  );
};

/**
 * Check if an object has any properties
 */
export function hasProperties(obj: object): boolean {
  for (const key in obj) {
    return true;
  }
  return false;
}
