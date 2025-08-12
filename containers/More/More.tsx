import type { MoreFilters } from "../../store/filters/filtersTypes";
import type {
  SquareFeetRangeFilters,
  YearBuiltRangeFilters
} from "../../store/filters/filtersTypes";
import type { AppState } from "../../store";
import styles from "./More.module.css";
import { useAppSelector, useAppDispatch } from "../../hooks/app_hooks";
import { useRunCallbackIfChanged } from "../../hooks/run_callback_if_changed_hook";
import { searchWithUpdatedFilters } from "../../store/listingSearch/listingSearchCommon";
import { setFilters } from "../../store/filters/filtersSlice";
import {
  selectSquareFeetRange,
  selectYearBuiltRange,
  selectFeatures
} from "../../store/filters/filtersSelectors";
import SearchTypeSelector from "../../components/form/SearchTypeSelector/SearchTypeSelector";
import PriceContainer from "../PriceContainer/PriceContainer";
import BedsAndBaths from "~/components/form/BedsAndBaths/BedsAndBaths";
import IncludePending from "../../components/form/IncludePending/IncludePending";
import PropertyType from "../../components/form/PropertyTypes/PropertyTypes";
import SquareFeet from "../../components/form/SquareFeet/SquareFeet";
import LotSize from "../../components/form/LotSize/LotSize";
import YearBuilt from "../../components/form/YearBuilt/YearBuilt";
import OpenHouse from "../../components/form/OpenHouse/OpenHouse";
import Features from "../../components/form/Features/Features";
import SoldDays from "../../components/form/SoldDays/SoldDays";
import { SearchTypes } from "../../lib/filter";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import { ParamDefaults } from "~/lib/listingSearchParams";

const More: React.FC = () => {
  const { searchParamsState, updateSearchParams } = useSearchParamsState();

  const dispatch = useAppDispatch();
  const squareFeetRange = useAppSelector(selectSquareFeetRange);
  const lotSizeMin = useAppSelector(
    (state: AppState) => state.filters.lotSizeMin
  );
  const yearBuiltRange = useAppSelector(selectYearBuiltRange);
  const features = useAppSelector(selectFeatures);

  const [setPreviousYearBuilt, runSearchIfYearBuiltChanged] =
    useRunCallbackIfChanged<YearBuiltRangeFilters>(yearBuiltRange, () =>
      dispatch(searchWithUpdatedFilters())
    );
  const [setPreviousSquareFeetRange, runSearchIfSquareFeetChanged] =
    useRunCallbackIfChanged<SquareFeetRangeFilters>(squareFeetRange, () =>
      dispatch(searchWithUpdatedFilters())
    );

  const handleChange = (params: Partial<MoreFilters>) => {
    dispatch(setFilters(params));
  };

  const handleChangeAndInitiateSearch = (params: Partial<MoreFilters>) => {
    dispatch(setFilters(params));
    dispatch(searchWithUpdatedFilters());
  };

  const searchType = searchParamsState.search_type ?? SearchTypes.Buy;

  return (
    <div className={styles.more}>
      <SearchTypeSelector
        searchType={searchType}
        onChange={(search_type) => updateSearchParams({ search_type })}
      />
      <div className={styles.mobileFilters}>
        <PriceContainer />
        <BedsAndBaths />
      </div>
      {searchType === SearchTypes.Buy && (
        <div className={styles.buyFilters}>
          <OpenHouse
            checked={searchParamsState.open_houses ?? ParamDefaults.open_houses}
            onChange={(e) =>
              updateSearchParams({ open_houses: e.target.checked })
            }
          />
          <IncludePending
            includePending={
              searchParamsState.include_pending ?? ParamDefaults.include_pending
            }
            onChange={(include_pending) =>
              updateSearchParams({ include_pending })
            }
          />
        </div>
      )}
      {searchType !== SearchTypes.Rent && <PropertyType />}
      {searchType === SearchTypes.Sold && (
        <SoldDays
          soldInLast={
            searchParamsState.sold_in_last ?? ParamDefaults.sold_in_last
          }
          onChange={(sold_in_last) => updateSearchParams({ sold_in_last })}
        />
      )}
      <SquareFeet
        squareFeetRange={squareFeetRange}
        onChange={handleChange}
        onFocus={setPreviousSquareFeetRange}
        onBlur={runSearchIfSquareFeetChanged}
      />
      <LotSize
        lotSizeMin={lotSizeMin}
        onChange={handleChangeAndInitiateSearch}
      />
      <YearBuilt
        yearBuiltRange={yearBuiltRange}
        onChange={handleChange}
        onFocus={setPreviousYearBuilt}
        onBlur={runSearchIfYearBuiltChanged}
      />
      <Features
        featureFilters={features}
        onChange={handleChangeAndInitiateSearch}
      />
    </div>
  );
};

export default More;
