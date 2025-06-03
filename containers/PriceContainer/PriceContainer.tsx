import { useAppDispatch, useAppSelector } from "../../hooks/app_hooks";
import { useRunCallbackIfChanged } from "../../hooks/run_callback_if_changed_hook";
import { selectPriceRange } from "../../store/filters/filtersSelectors";
import { setFilters } from "../../store/filters/filtersSlice";
import { searchWithUpdatedFilters } from "../../store/listingSearch/listingSearchCommon";
import PriceRange from "../../components/form/PriceRange/PriceRange";

/**
 * A Container component to connect the <PriceRange> component to the store.
 */
const PriceContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector(selectPriceRange);
  const [setPreviousPriceRange, runSearchIfPriceRangeChanged] =
    useRunCallbackIfChanged(priceRange, () =>
      dispatch(searchWithUpdatedFilters())
    );

  return (
    <PriceRange
      priceRange={priceRange}
      onChange={(priceRange) => {
        dispatch(setFilters(priceRange));
      }}
      onFocus={setPreviousPriceRange}
      onBlur={runSearchIfPriceRangeChanged}
      onMenuItemSelected={(priceRange) => {
        dispatch(setFilters(priceRange));
        dispatch(searchWithUpdatedFilters());
      }}
    />
  );
};

export default PriceContainer;
