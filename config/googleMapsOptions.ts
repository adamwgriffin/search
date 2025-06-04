import type { Libraries, LoaderOptions } from "@googlemaps/js-api-loader";

export const GoogleMapsStreetViewURL =
  "https://maps.googleapis.com/maps/api/streetview";

export const GoogleStreetViewMaxImageSize = 640;

// Options for @googlemaps/loader, which loads Google Maps by creating a script
// tag with these params in it. Things like your api key and the libraries you
// want to load go here
export const DefaultGoogleMapsLoaderOptions: LoaderOptions = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: "quarterly"
};

export const DefaultGoogleMapsLibraries: Libraries = [
  "maps",
  "places",
  "marker"
];

// Default options for the map itself, such as what UI controls to enable, etc.
// Seems that we can't use Object.freeze on this object, otherwise the map won't
// load
export const GoogleMapsMapOptions: google.maps.MapOptions = {
  // Using a mapId is required for using AdvancedMarkerView
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID!,
  center: {
    lat: 47.6560479,
    lng: -122.3603527
  },
  clickableIcons: false,
  zoom: 12,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false
};

export const GoogleMapsAutocompleteOptions = {
  // types restricts the autocomplete results to only a specific set of place
  // types. The "geocode" type seems to be the only decent choice for both
  // addresses and places like neighborhoods/cities/states, etc. The places API
  // has weird, strict rules about what types you can and can't use, which makes
  // it really difficult to get very granular with the specific types we would
  // normally want to use.
  types: ["geocode"],
  componentRestrictions: { country: ["us"] }
};

export const GoogleMapsPolygonOptions: google.maps.PolygonOptions = {
  strokeColor: "#006AFF",
  strokeOpacity: 0.5,
  strokeWeight: 3,
  fillOpacity: 0
};
