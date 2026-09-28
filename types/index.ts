import { Listing } from "./listing_types";

export interface CountOption {
  label: string;
  value: number;
  checked?: boolean;
}

export type DefaultAPIResponse = null | { error: string };

export type SearchParamsInit =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams
  | undefined;

export type PhotoGalleryImage = {
  _id: string;
  url: string;
  caption?: string;
};

export type Address = {
  city: string;
  line1: string;
  state: string;
  zip: string;
};

export type ListingSearchPagination = {
  numberAvailable: number;
  numberOfPages: number;
  numberReturned: number;
  page: number;
  pageSize: number;
};

export type Position = [longitude: number, latitude: number];

export type Polygon = {
  type: "Polygon";
  coordinates: Position[][];
};

export type MultiPolygon = {
  type: "MultiPolygon";
  coordinates: Position[][][];
};

export type Geometry = (Polygon | MultiPolygon) & { _id: string };

export type Boundary = {
  _id: string;
  name: string;
  placeId: string;
  type: string;
  geometry: Geometry;
};

export type GeoJSONBoundary = {
  type: "Feature";
  id: string;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: Position[][] | Position[][][];
  };
};

export type ViewportLatLngBounds = {
  northeast: google.maps.LatLngLiteral;
  southwest: google.maps.LatLngLiteral;
};

export type ListingSearchResponse = {
  boundary?: Boundary;
  listings?: Listing[];
  pagination?: ListingSearchPagination;
  viewport?: ViewportLatLngBounds;
};

export type SortType = "listedDate" | "listPrice" | "beds" | "baths" | "sqft";

export type SortDirection = "asc" | "desc";
