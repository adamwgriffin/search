import { z } from "zod";
import { booleanEnum } from ".";
import {
  sortDirectionSchema,
  sortTypeSchema
} from "./listingSearchParamsSchema";
import { featureFiltersSchema } from ".";

/** A type which represents params that can be added to the url. Most of these
 * are listing service request filters but there are additional params for app
 * state as well. */
export const searchStateSchema = z
  .object({
    search_type: z.enum(["buy", "rent", "sold"]),
    address: z.string(),
    place_id: z.string(),
    address_types: z.string(),
    bounds: z.string(),
    boundary_id: z.string(),
    zoom: z.coerce.number(),
    property_type: z.string(),
    include_pending: booleanEnum,
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
    sold_in_last: z.coerce.number()
  })
  .merge(featureFiltersSchema)
  .partial();

export type SearchState = z.infer<typeof searchStateSchema>;

// Using "null" in an update indicates that the value should be removed
export type SearchStateUpdate = {
  [K in keyof SearchState]: SearchState[K] | null;
};
