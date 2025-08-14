import { useEffect, useState } from "react";
import YearBuilt from "@/components/form/YearBuilt/YearBuilt";
import { useSearchState } from "@/providers/SearchStateProvider";
import type { YearBuiltRangeFilters } from "@/types/filtersTypes";

const YearBuiltContainer: React.FC = () => {
  const { searchState, setSearchState } = useSearchState();
  const [currentRange, setCurrentRange] = useState<YearBuiltRangeFilters>({
    yearBuiltMin: searchState.year_built_min ?? null,
    yearBuiltMax: searchState.year_built_max ?? null
  });

  useEffect(() => {
    setCurrentRange({
      yearBuiltMin: searchState.year_built_min ?? null,
      yearBuiltMax: searchState.year_built_max ?? null
    });
  }, [searchState]);

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
