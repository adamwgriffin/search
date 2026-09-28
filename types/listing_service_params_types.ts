export type SortType = "listedDate" | "listPrice" | "beds" | "baths" | "sqft";

export type SortDirection = "asc" | "desc";

// listing service params that are mostly only sent when composing a listing service request. these names aren't used in
// the app state much.
export interface ListingServiceRequestParams {
  lat: number;
  lng: number;
  bounds_north: number;
  bounds_east: number;
  bounds_south: number;
  bounds_west: number;
  address: string;
  place_id: string;
  /** A comma-separated list of types that the prediction belongs to */
  address_types: string;
  rental: boolean;
  page_index: number;
  page_size: number;
  price_min: number | null;
  price_max: number | null;
  beds_min: number | null;
  baths_min: number | null;
  sqft_min: number | null;
  sqft_max: number | null;
  sort_by: SortType;
  sort_direction: SortDirection;
  lot_size_min: number | null;
  year_built_min: number | null;
  year_built_max: number | null;
  open_house_after: string | null;
  sold_in_last: number | null;
  property_type: string | null;
  status: string | null;
  waterfront: boolean | null;
  view: boolean | null;
  fireplace: boolean | null;
  basement: boolean | null;
  garage: boolean | null;
  new_construction: boolean | null;
  pool: boolean | null;
  air_conditioning: boolean | null;
  // Index signature, allows us to index like so: params['key']
  [key: string]:
    | number
    | string
    | boolean
    | SortType
    | SortDirection
    | null
    | undefined
    | Date;
}

export type ListingServiceParams = Partial<ListingServiceRequestParams>;

export type BoundsParams = Pick<
  ListingServiceRequestParams,
  "bounds_north" | "bounds_east" | "bounds_south" | "bounds_west"
>;
