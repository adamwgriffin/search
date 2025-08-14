import { useEffect, useState } from "react";
import { useSearchState } from "@/providers/SearchStateProvider";
import type { PriceRangeFilters } from "@/store/filters/filtersTypes";
import PriceRange from "../../components/form/PriceRange/PriceRange";

const PriceContainer: React.FC = () => {
  const { searchState, setSearchState } = useSearchState();
  const [priceRange, setPriceRange] = useState<PriceRangeFilters>({
    priceMin: searchState.price_min || null,
    priceMax: searchState.price_max || null
  });

  useEffect(() => {
    setPriceRange({
      priceMin: searchState.price_min || null,
      priceMax: searchState.price_max || null
    });
  }, [searchState.price_max, searchState.price_min]);

  // The onChange event keeps track of the current state of each price field, so
  // we're tracking that locally with useState, but we only want to update the
  // url and trigger a new fetch request with setSearchState when the onBlur or
  // onMenuItemSelected events occur.
  return (
    <PriceRange
      priceRange={priceRange}
      onChange={(newPriceRange) => {
        setPriceRange({ ...priceRange, ...newPriceRange });
      }}
      onBlur={() =>
        setSearchState({
          price_min: priceRange.priceMin,
          price_max: priceRange.priceMax
        })
      }
      onMenuItemSelected={(selectedPriceRange) => {
        const update = { ...priceRange, ...selectedPriceRange };
        setSearchState({
          price_min: update.priceMin || null,
          price_max: update.priceMax || null
        });
      }}
    />
  );
};

export default PriceContainer;
