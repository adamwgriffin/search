import type { BedsAndBathsFilters } from "../../../store/filters/filtersTypes";
import { CountOption } from "../../../types";

export const DefaultBedBathCount = [0, 1, 2, 3, 4, 5];

export const RadioButtonGroups = [
  { param: "bedsMin", label: "Beds" },
  { param: "bathsMin", label: "Baths" }
];

export const countOptions = (
  param: string,
  countArr: number[],
  bedsAndBaths: BedsAndBathsFilters
): CountOption[] => {
  return countArr.map((c) => ({
    label: c ? `${c}+` : "Any",
    value: c,
    checked: c === Number(bedsAndBaths[param as keyof BedsAndBathsFilters])
  }));
};
