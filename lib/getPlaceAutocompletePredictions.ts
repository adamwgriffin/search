import { GoogleMapsAutocompleteOptions } from "@/config/googleMapsOptions";

export async function getPlaceAutocompletePredictions(
  searchString: string | null
): Promise<google.maps.places.PlacePrediction[]> {
  if (!searchString) return [];
  const { suggestions } =
    await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
      {
        input: searchString,
        ...GoogleMapsAutocompleteOptions
      }
    );
  return suggestions.flatMap((s) =>
    s.placePrediction ? [s.placePrediction] : []
  );
}
