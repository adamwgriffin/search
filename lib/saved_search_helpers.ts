import type {
  FiltersState,
  SearchTypeOption
} from "../store/filters/filtersTypes";
import { SearchTypes } from "./filter";
import { SearchTypeLabels } from "./filter";
import { getPropertyTypeLabel } from "./property_types";
import { formatPrice, ShortCurrencyFormat } from "./listing_helpers";

export const getSearchDescription = (
  savedSearchState: Partial<FiltersState>
) => {
  const { searchType, priceMin, priceMax, propertyTypes, bedsMin, bathsMin } =
    savedSearchState;
  const searchTypeOption = searchType ? searchType : SearchTypes.Buy;
  let description: string[] = [];

  description.push(SearchTypeLabels[searchTypeOption]);
  if (priceMin || priceMax) {
    description.push(formatPriceRange(priceMin, priceMax, searchTypeOption));
  }
  if (propertyTypes) {
    description.push(
      propertyTypes.map((t) => getPropertyTypeLabel(t)).join(", ")
    );
  }
  if (bedsMin) {
    description.push(`${bedsMin}+ beds`);
  }
  if (bathsMin) {
    description.push(`${bathsMin}+ baths`);
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
