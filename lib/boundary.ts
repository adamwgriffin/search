import type { Boundary, GeoJSONBoundary, ViewportLatLngBounds } from "../types";

// Setting id on the top level instead of inside "properties" makes it so
// map.data.getFeatureById() will find it automatically without us having to
// specify idPropertyName when adding the geojson.
export function convertBoundaryToGeoJSON(boundary: Boundary): GeoJSONBoundary {
  return {
    type: "Feature",
    id: boundary._id,
    geometry: {
      type: boundary.geometry.type,
      coordinates: boundary.geometry.coordinates
    }
  };
}

export function convertURLBoundsParamToLatLngBoundsLiteral(
  boundsString: string
): google.maps.LatLngBoundsLiteral {
  const [south, west, north, east] = boundsString.split(",").map(Number);
  return { south, west, north, east };
}

export function getBoundsForFeature(feature: google.maps.Data.Feature) {
  const bounds = new google.maps.LatLngBounds();
  feature?.getGeometry()?.forEachLatLng((latlng) => {
    bounds.extend(latlng);
  });
  return bounds;
}

export function getAvailableBoundsFromSearchResults(
  feature: google.maps.Data.Feature | undefined,
  viewport: ViewportLatLngBounds | undefined
) {
  if (feature) {
    return getBoundsForFeature(feature);
  }
  if (viewport) {
    return new google.maps.LatLngBounds(viewport.southwest, viewport.northeast);
  }
}
