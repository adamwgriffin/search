import { useState } from "react";
import YearBuilt from "@/components/form/YearBuilt/YearBuilt";
import { useSearchState } from "@/hooks/useSearchState";
import type { YearBuiltRangeFilters } from "@/types/filtersTypes";

const YearBuiltContainer: React.FC = () => {
  const { searchState, setSearchState } = useSearchState();
  const urlRange: YearBuiltRangeFilters = {
    yearBuiltMin: searchState.year_built_min ?? null,
    yearBuiltMax: searchState.year_built_max ?? null
  };
  const [currentRange, setCurrentRange] = useState(urlRange);
  const [prevUrlRange, setPrevUrlRange] = useState(urlRange);

  // Reset the local state whenever the year built params in the url change
  // (e.g., after filters are cleared or the user navigates back/forward).
  // Doing this during render rather than in an effect avoids an extra render
  // with stale values. See
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (
    urlRange.yearBuiltMin !== prevUrlRange.yearBuiltMin ||
    urlRange.yearBuiltMax !== prevUrlRange.yearBuiltMax
  ) {
    setPrevUrlRange(urlRange);
    setCurrentRange(urlRange);
  }

  return (
    <YearBuilt
      yearBuiltRange={currentRange}
      onChange={(newRange) => setCurrentRange(newRange)}
      onBlur={() =>
        setSearchState({
          year_built_min: currentRange.yearBuiltMin,
          year_built_max: currentRange.yearBuiltMax
        })
      }
    />
  );
};

export default YearBuiltContainer;
