import type { MoreFilters } from "../../store/filters/filtersTypes";
import type { AppState } from "../../store";
import styles from "./More.module.css";
import { useAppSelector, useAppDispatch } from "../../hooks/app_hooks";
import { searchWithUpdatedFilters } from "../../store/listingSearch/listingSearchCommon";
import { setFilters } from "../../store/filters/filtersSlice";
import {
  selectFeatures
} from "../../store/filters/filtersSelectors";
import SearchTypeSelector from "../../components/form/SearchTypeSelector/SearchTypeSelector";
import PriceContainer from "../PriceContainer/PriceContainer";
import BedsAndBaths from "~/components/form/BedsAndBaths/BedsAndBaths";
import IncludePending from "../../components/form/IncludePending/IncludePending";
import PropertyType from "../../components/form/PropertyTypes/PropertyTypes";
import SquareFeet from "../../components/form/SquareFeet/SquareFeet";
import LotSize from "../../components/form/LotSize/LotSize";
import OpenHouse from "../../components/form/OpenHouse/OpenHouse";
import Features from "../../components/form/Features/Features";
import SoldDays from "../../components/form/SoldDays/SoldDays";
import { SearchTypes } from "../../lib/filter";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import { ParamDefaults } from "~/lib/listingSearchParams";
import YearBuiltContainer from "../YearBuiltContainer/YearBuiltContainer";

const More: React.FC = () => {
  const { searchParamsState, updateSearchParams } = useSearchParamsState();

  const dispatch = useAppDispatch();
  const lotSizeMin = useAppSelector(
    (state: AppState) => state.filters.lotSizeMin
  );
  const features = useAppSelector(selectFeatures);

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
        squareFeetRange={{
          sqftMin: searchParamsState.sqft_min ?? null,
          sqftMax: searchParamsState.sqft_max ?? null
        }}
        onBlur={({ sqftMin, sqftMax }) => {
          updateSearchParams({ sqft_min: sqftMin, sqft_max: sqftMax });
        }}
      />
      <LotSize
        lotSizeMin={lotSizeMin}
        onChange={handleChangeAndInitiateSearch}
      />
      <YearBuiltContainer />
      <Features
        featureFilters={features}
        onChange={handleChangeAndInitiateSearch}
      />
    </div>
  );
};

export default More;
