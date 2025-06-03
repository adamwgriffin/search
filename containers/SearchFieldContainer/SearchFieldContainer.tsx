import type { NextPage } from "next";
import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/app_hooks";
import { setFilters } from "../../store/filters/filtersSlice";
import { selectLocationSearchField } from "../../store/filters/filtersSelectors";
import {
  getPlaceAutocompletePredictions,
  resetAutcompletePlacePredictions,
  autocompletePredictionSelected
} from "../../store/autocomplete/autocompleteSlice";
import { selectAutcompletePlacePredictions } from "../../store/autocomplete/autocompleteSelectors";
import SearchField from "../../components/form/SearchField/SearchField";

export interface SearchFieldContainerProps {
  onSearchInitiated?: () => void;
  onOptionSelected?: (
    option: google.maps.places.AutocompletePrediction
  ) => void;
}

// A container that simply wraps SearchField and connects it to the redux store
const SearchFieldContainer: NextPage<SearchFieldContainerProps> = ({
  onSearchInitiated,
  onOptionSelected
}) => {
  const dispatch = useAppDispatch();
  const locationSearchField = useAppSelector(selectLocationSearchField);
  const options = useAppSelector(selectAutcompletePlacePredictions);

  const handleOnOptionSelected = useCallback(
    (autocompletePrediction: google.maps.places.AutocompletePrediction) => {
      dispatch(autocompletePredictionSelected(autocompletePrediction));
      onOptionSelected?.(autocompletePrediction);
    },
    [dispatch, onOptionSelected]
  );

  return (
    <SearchField
      value={locationSearchField}
      options={options}
      onInput={(details) =>
        dispatch(setFilters({ locationSearchField: details }))
      }
      onGetPlaceAutocompletePredictions={(val) =>
        dispatch(getPlaceAutocompletePredictions(val))
      }
      onClearPlaceAutocompletePredictions={() =>
        dispatch(resetAutcompletePlacePredictions())
      }
      onSearchInitiated={() => locationSearchField && onSearchInitiated?.()}
      onOptionSelected={handleOnOptionSelected}
      placeholder="Search Seattle"
    />
  );
};

export default SearchFieldContainer;
