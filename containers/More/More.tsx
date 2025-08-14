import styles from "./More.module.css";
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
import { useSearchState } from "~/providers/SearchStateProvider";
import { ParamDefaults } from "~/lib/listingSearchParams";
import YearBuiltContainer from "../YearBuiltContainer/YearBuiltContainer";

const More: React.FC = () => {
  const { searchState, searchType, setSearchState, setSearchType } =
    useSearchState();

  return (
    <div className={styles.more}>
      <SearchTypeSelector
        searchType={searchType}
        onChange={(search_type) => setSearchType(search_type)}
      />
      <div className={styles.mobileFilters}>
        <PriceContainer />
        <BedsAndBaths />
      </div>
      {searchType === SearchTypes.Buy && (
        <div className={styles.buyFilters}>
          <OpenHouse
            checked={searchState.open_houses ?? ParamDefaults.open_houses}
            onChange={(e) => setSearchState({ open_houses: e.target.checked })}
          />
          <IncludePending
            includePending={
              searchState.include_pending ?? ParamDefaults.include_pending
            }
            onChange={(include_pending) => setSearchState({ include_pending })}
          />
        </div>
      )}
      {searchType !== SearchTypes.Rent && <PropertyType />}
      {searchType === SearchTypes.Sold && (
        <SoldDays
          soldInLast={searchState.sold_in_last ?? ParamDefaults.sold_in_last}
          onChange={(sold_in_last) => setSearchState({ sold_in_last })}
        />
      )}
      <SquareFeet
        squareFeetRange={{
          sqftMin: searchState.sqft_min ?? null,
          sqftMax: searchState.sqft_max ?? null
        }}
        onBlur={({ sqftMin, sqftMax }) => {
          setSearchState({ sqft_min: sqftMin, sqft_max: sqftMax });
        }}
      />
      <LotSize
        lotSizeMin={searchState.lot_size_min ?? null}
        onChange={(lot_size_min) => setSearchState({ lot_size_min })}
      />
      <YearBuiltContainer />
      <Features
        featureFilters={{
          waterfront: !!searchState.waterfront,
          view: !!searchState.view,
          fireplace: !!searchState.fireplace,
          basement: !!searchState.basement,
          garage: !!searchState.garage,
          new_construction: !!searchState.new_construction,
          pool: !!searchState.pool,
          air_conditioning: !!searchState.air_conditioning
        }}
        onChange={(param) => setSearchState(param)}
      />
    </div>
  );
};

export default More;
