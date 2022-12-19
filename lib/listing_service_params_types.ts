export type SortById =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18

export type ListingServiceGeotype =
  | 'AdminDivision1'
  | 'AdminDivision2'
  | 'AdminDivision3'
  | 'Postcode1'
  | 'Neighborhood'
  | 'PopulatedPlace'
  | 'Address'
  | 'NaturalFeature'

export type OpenHouseScheduleID = 2 | 3 | 4 | 5 | 6 | 7 | null

export interface OpenHouseScheduleIDEnumInterface {
  upcomingWeekend: OpenHouseScheduleID
  thisSaturday: OpenHouseScheduleID
  thisSunday: OpenHouseScheduleID
  todayThroughSunday: OpenHouseScheduleID
  today: OpenHouseScheduleID
  tomorrow: OpenHouseScheduleID
}

// listing service params that are used as filters. also used to maintain filter state in the app
export interface FilterParams {
  startidx: number
  pgsize: number
  pricemin: number | null
  pricemax: number | null
  bed_min: number | null
  bath_min: number | null
  status: 'active' | 'sold'
  ex_pend: boolean | null
  ex_cs: boolean | null
  sqft_min: number | null
  sqft_max: number | null
  sort_by: SortById
  lotsize_min: number | null
  yearblt_min: number | null
  yearblt_max: number | null
  openhouse: OpenHouseScheduleID
}

export type FilterParamsPartial = Partial<FilterParams>

// listing service params that are mostly only sent when composing a listing service request. these names aren't used in
// the app state much.
export interface ListingServiceParams extends FilterParamsPartial {
  company_uuid?: string
  center_lat?: number
  center_lon?: number
  bounds_north?: number
  bounds_east?: number
  bounds_south?: number
  bounds_west?: number
  geotype?: ListingServiceGeotype
  street?: string
  ptype?: string | null
}

export type CenterLatLonParams = Pick<
  ListingServiceParams,
  'center_lat' | 'center_lon'
>

export type BoundsParams = Pick<
  ListingServiceParams,
  'bounds_north' | 'bounds_east' | 'bounds_west' | 'bounds_south'
>

export type PriceRangeParams = Pick<FilterParams, 'pricemin' | 'pricemax'>

export type SquareFeetRangeParams = Pick<FilterParams, 'sqft_min' | 'sqft_max'>

export type LotSizeParams = Pick<FilterParams, 'lotsize_min'>

export type YearBuiltRangeParams = Pick<FilterParams, 'yearblt_min' | 'yearblt_max'>

export type ExcludeStatusParams = Pick<FilterParams, 'ex_pend' | 'ex_cs'>

export type OpenHouseParam = Pick<FilterParams, 'openhouse'>

export type MoreFiltersParams = Pick<
  FilterParams,
  | 'ex_pend'
  | 'ex_cs'
  | 'sqft_min'
  | 'sqft_max'
  | 'lotsize_min'
  | 'yearblt_min'
  | 'yearblt_max'
  | 'openhouse'
>

export type MoreFiltersParamsPartial = Partial<MoreFiltersParams>

export type BedsBathsParam = Pick<FilterParams, 'bed_min' | 'bath_min'>

export interface SortByEnum {
  baths_desc: SortById
  baths_asc: SortById
  beds_desc: SortById
  beds_asc: SortById
  distance_from_user_lat_lon_asc: SortById
  distance_from_user_lat_lon_desc: SortById
  listing_date_asc: SortById
  listing_date_desc: SortById
  price_desc: SortById
  price_asc: SortById
  status_category_asc: SortById
  status_category_desc: SortById
  total_square_footage_desc: SortById
  total_square_footage_asc: SortById
  total_lot_square_footage_desc: SortById
  total_lot_square_footage_asc: SortById
  sold_date_desc: SortById
  sold_date_asc: SortById
}