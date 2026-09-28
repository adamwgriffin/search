import type { SearchTypeOption } from "../types/filtersTypes";
import { SearchTypes } from "./filter";
import { SearchTypeLabels } from "./filter";
import { getPropertyTypeLabel } from "./property_types";
import { formatPrice, ShortCurrencyFormat } from "./listing_helpers";
import { type SearchState } from "@/zod_schemas/searchStateSchema";
import { PropertyType } from "./property_types";

export const getSearchDescription = (savedSearchState: SearchState) => {
  const {
    search_type,
    price_min,
    price_max,
    property_type,
    beds_min,
    baths_min
  } = savedSearchState;
  const searchTypeOption = search_type ?? SearchTypes.Buy;
  let description: string[] = [];

  description.push(SearchTypeLabels[searchTypeOption]);
  if (price_min || price_max) {
    description.push(formatPriceRange(price_min, price_max, searchTypeOption));
  }
  if (property_type) {
    description.push(
      property_type
        .split(",")
        .map((t) => getPropertyTypeLabel(t as PropertyType))
        .join(", ")
    );
  }
  if (beds_min) {
    description.push(`${beds_min}+ beds`);
  }
  if (baths_min) {
    description.push(`${baths_min}+ baths`);
  }
  return description.join(" | ");
};

export const priceAbbreviated = (
  searchTypeOption: SearchTypeOption,
  priceMin: number
) => {
  const rental = searchTypeOption === SearchTypes.Rent;
  return formatPrice(priceMin, rental, {
    numberFormatOptions: ShortCurrencyFormat,
    displayInterval: false
  });
};

export const formatPriceRange = (
  priceMin: number | null | undefined,
  priceMax: number | null | undefined,
  searchTypeOption: SearchTypeOption
) => {
  return [priceMin, priceMax]
    .map((price) => priceAbbreviated(searchTypeOption, price || 0))
    .join(" - ");
};
