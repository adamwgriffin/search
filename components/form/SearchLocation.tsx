"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPlaceAutocompletePredictions } from "@/lib/getPlaceAutocompletePredictions";
import SearchField from "./SearchField/SearchField";
import { useSearchState } from "@/hooks/useSearchState";

export default function SearchLocation() {
  const { searchState, setNewLocation } = useSearchState();
  const [value, setValue] = useState(searchState.address);
  const [searchString, setSearchString] = useState<string | null>(null);
  const { data, isError, error } = useQuery({
    queryKey: ["searchString", searchString],
    queryFn: () => getPlaceAutocompletePredictions(searchString),
    placeholderData: keepPreviousData
  });

  if (isError) {
    console.error("Error fetching autocomplete:", error);
  }

  return (
    <form name="search-form" onSubmit={(e) => e.preventDefault()}>
      <SearchField
        value={value ?? ""}
        options={data || []}
        onInput={(details) => setValue(details)}
        onGetPlaceAutocompletePredictions={(val) => setSearchString(val)}
        onClearPlaceAutocompletePredictions={() => setSearchString(null)}
        onSearchInitiated={() => {
          // Remove place_id & address_types since the user likely typed a free
          // form location rather than something from the dropdown
          if (value)
            setNewLocation({
              address: value
            });
        }}
        onOptionSelected={(placePrediction) => {
          setValue(placePrediction.text.text);
          setNewLocation({
            address: placePrediction.text.text,
            place_id: placePrediction.placeId,
            address_types: placePrediction.types.join(",")
          });
        }}
      />
    </form>
  );
}
