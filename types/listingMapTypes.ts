export type MultiPolygon = Array<Array<Array<Array<number>>>>;

export type GeoLayerCoordinates = Array<Array<google.maps.LatLngLiteral>>;

export type ViewportLatLngBounds = {
  northeast: google.maps.LatLngLiteral;
  southwest: google.maps.LatLngLiteral;
};

export interface ListingMapState {
  boundaryActive: boolean;
  boundsNorth: number;
  boundsEast: number;
  boundsSouth: number;
  boundsWest: number;
  zoom: number;
  geoLayerCoordinates: GeoLayerCoordinates;
  viewportBounds: ViewportLatLngBounds | null;
}

export type ListingMapStateForMap = Omit<
  ListingMapState,
  "boundsNorth" | "boundsEast" | "boundsSouth" | "boundsWest"
>;
