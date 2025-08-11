import { GoogleMapsAutocompleteOptions } from "~/config/googleMapsOptions";

let autocompleteService: google.maps.places.AutocompleteService;

export async function getPlaceAutocompletePredictions(
  searchString: string | null
) {
  if (!searchString) return [];
  autocompleteService ||= new google.maps.places.AutocompleteService();
  const res = await autocompleteService.getPlacePredictions({
    input: searchString,
    ...GoogleMapsAutocompleteOptions
  });
  return res.predictions;
}
