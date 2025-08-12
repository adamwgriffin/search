import { useEffect, useState } from "react";
import YearBuilt from "~/components/form/YearBuilt/YearBuilt";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import type { YearBuiltRangeFilters } from "~/store/filters/filtersTypes";

const YearBuiltContainer: React.FC = () => {
  const { searchParamsState, updateSearchParams } = useSearchParamsState();
  const [currentRange, setCurrentRange] = useState<YearBuiltRangeFilters>({
    yearBuiltMin: searchParamsState.year_built_min ?? null,
    yearBuiltMax: searchParamsState.year_built_max ?? null
  });

  useEffect(() => {
    setCurrentRange({
      yearBuiltMin: searchParamsState.year_built_min ?? null,
      yearBuiltMax: searchParamsState.year_built_max ?? null
    });
  }, [searchParamsState]);

  return (
    <YearBuilt
      yearBuiltRange={currentRange}
      onChange={(newRange) => setCurrentRange(newRange)}
      onBlur={() =>
        updateSearchParams({
          year_built_min: currentRange.yearBuiltMin,
          year_built_max: currentRange.yearBuiltMax
        })
      }
    />
  );
};

export default YearBuiltContainer;
