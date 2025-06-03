import type { BedsAndBathsFilters } from "../../store/filters/filtersTypes";
import { useAppDispatch, useAppSelector } from "../../hooks/app_hooks";
import { selectBedBathFilters } from "../../store/filters/filtersSelectors";
import { setFilters } from "../../store/filters/filtersSlice";
import { searchWithUpdatedFilters } from "../../store/listingSearch/listingSearchCommon";
import BedsAndBaths from "../../components/form/BedsAndBaths/BedsAndBaths";

const BedsAndBathsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const bedsAndBaths = useAppSelector(selectBedBathFilters);

  return (
    <BedsAndBaths
      onChange={(param: Partial<BedsAndBathsFilters>) => {
        dispatch(setFilters(param));
        dispatch(searchWithUpdatedFilters());
      }}
      bedsAndBaths={bedsAndBaths}
    />
  );
};

export default BedsAndBathsContainer;
