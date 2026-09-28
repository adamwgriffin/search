import { SearchTypes } from "@/lib/filter";

export type SearchTypeOption = (typeof SearchTypes)[keyof typeof SearchTypes];

export type PriceRangeFilters = {
  priceMin: number | null;
  priceMax: number | null;
};

export type BedsAndBathsFilters = {
  bedsMin: number | null;
  bathsMin: number | null;
};

export type SquareFeetRangeFilters = {
  sqftMin: number | null;
  sqftMax: number | null;
};

export type LotSizeFilter = {
  lotSizeMin: number | null;
};

export type YearBuiltRangeFilters = {
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
};
