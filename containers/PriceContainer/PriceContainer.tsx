import { useState } from "react";
import { useSearchState } from "@/hooks/useSearchState";
import type { PriceRangeFilters } from "@/types/filtersTypes";
import PriceRange from "@/components/form/PriceRange/PriceRange";

const PriceContainer: React.FC = () => {
  const { searchState, setSearchState } = useSearchState();
  const currentPriceRange: PriceRangeFilters = {
    priceMin: searchState.price_min || null,
    priceMax: searchState.price_max || null
  };
  const [localPriceRange, setLocalPriceRange] = useState(currentPriceRange);
  const [prevPriceRange, setPrevPriceRange] = useState(currentPriceRange);

  // Reset the local state whenever the price params in searchState change (e.g.,
  // after a menu item is selected, filters are cleared, or the user navigates
  // back/forward). Doing this during render rather than in an effect avoids an
  // extra render with stale values. See
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (
    currentPriceRange.priceMin !== prevPriceRange.priceMin ||
    currentPriceRange.priceMax !== prevPriceRange.priceMax
  ) {
    setPrevPriceRange(currentPriceRange);
    setLocalPriceRange(currentPriceRange);
  }

  // The onChange event keeps track of the current state of each price field, so
  // we're tracking that locally with useState, but we only want to update the
  // searchState, and trigger a new fetch request with setSearchState, when the
  // onBlur or onMenuItemSelected events occur.
  return (
    <PriceRange
      priceRange={localPriceRange}
      onChange={(newPriceRange) => {
        setLocalPriceRange({ ...localPriceRange, ...newPriceRange });
      }}
      onBlur={() =>
        setSearchState({
          price_min: localPriceRange.priceMin,
          price_max: localPriceRange.priceMax
        })
      }
      onMenuItemSelected={(selectedPriceRange) => {
        const update = { ...localPriceRange, ...selectedPriceRange };
        setLocalPriceRange(update);
        setSearchState({
          price_min: update.priceMin || null,
          price_max: update.priceMax || null
        });
      }}
    />
  );
};

export default PriceContainer;
