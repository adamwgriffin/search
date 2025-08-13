"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPlaceAutocompletePredictions } from "~/lib/getPlaceAutocompletePredictions";
import SearchField from "./SearchField/SearchField";
import { useSearchState } from "~/providers/SearchStateProvider";

export default function SearchLocation() {
  const { searchState, setNewLocation, setSearchState } = useSearchState();
  const [value, setValue] = useState(searchState.address);
  const [searchString, setSearchString] = useState<string | null>(null);
  const { data, isError, error } = useQuery({
    queryKey: ["searchString", searchString],
    queryFn: () => getPlaceAutocompletePredictions(searchString),
    staleTime: 1000 * 60,
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
          if (value) setSearchState({ address: value });
        }}
        onOptionSelected={(autocompletePrediction) => {
          setValue(autocompletePrediction.description);
          setNewLocation({
            place_id: autocompletePrediction.place_id,
            address_types: autocompletePrediction.types.join(",")
          });
        }}
      />
    </form>
  );
}
