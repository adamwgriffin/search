import { z } from 'zod'
import {
  booleanEnum,
  sortDirectionSchema,
  sortTypeSchema
} from './listingSearchParamsSchema'

export const searchParamsSchema = z
  .object({
    search_type: z.enum(['buy', 'rent', 'sold']),
    address: z.string(),
    bounds: z.string(),
    boundary_id: z.string(),
    zoom: z.coerce.number(),
    property_type: z.string(),
    include_pending: booleanEnum.default('false'),
    open_houses: booleanEnum,
    page_index: z.coerce.number(),
    price_min: z.coerce.number(),
    price_max: z.coerce.number(),
    beds_min: z.coerce.number(),
    baths_min: z.coerce.number(),
    sqft_min: z.coerce.number(),
    sqft_max: z.coerce.number(),
    sort_by: sortTypeSchema,
    sort_direction: sortDirectionSchema,
    lot_size_min: z.coerce.number(),
    year_built_min: z.coerce.number(),
    year_built_max: z.coerce.number(),
    waterfront: booleanEnum,
    view: booleanEnum,
    fireplace: booleanEnum,
    basement: booleanEnum,
    garage: booleanEnum,
    new_construction: booleanEnum,
    pool: booleanEnum,
    air_conditioning: booleanEnum,
    sold_in_last: z.coerce.number()
  })
  .partial()

export type SearchParams = z.infer<typeof searchParamsSchema>

// Using "null" in an updated indicates that the value shuld be removed
export type SearchParamsUpdate = {
  [K in keyof SearchParams]: SearchParams[K] | null
}
