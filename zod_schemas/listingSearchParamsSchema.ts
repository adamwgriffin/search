import { z } from "zod";
import { booleanEnum } from ".";

export const sortTypeSchema = z.enum([
  "listedDate",
  "listPrice",
  "beds",
  "baths",
  "sqft"
]);

export type SortType = z.infer<typeof sortTypeSchema>;

export const sortDirectionSchema = z.enum(["asc", "desc"]);

export type SortDirection = z.infer<typeof sortDirectionSchema>;

export const paginationParamsSchema = z.object({
  page_index: z.coerce.number(),
  page_size: z.coerce.number()
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export const listingFilterParamsSchema = z
  .object({
    price_min: z.coerce.number(),
    price_max: z.coerce.number(),
    beds_min: z.coerce.number(),
    beds_max: z.coerce.number(),
    baths_min: z.coerce.number(),
    baths_max: z.coerce.number(),
    sqft_min: z.coerce.number(),
    sqft_max: z.coerce.number(),
    year_built_min: z.coerce.number(),
    year_built_max: z.coerce.number(),
    lot_size_min: z.coerce.number(),
    lot_size_max: z.coerce.number(),
    sort_by: sortTypeSchema,
    sort_direction: sortDirectionSchema,
    sold_days: z.coerce.number(),
    property_type: z.string(),
    status: z.string(),
    waterfront: booleanEnum,
    view: booleanEnum,
    fireplace: booleanEnum,
    basement: booleanEnum,
    garage: booleanEnum,
    new_construction: booleanEnum,
    pool: booleanEnum,
    air_conditioning: booleanEnum,
    rental: booleanEnum,
    sold_in_last: z.coerce.number(),
    open_house_after: z.string(),
    open_house_before: z.string()
  })
  .extend(paginationParamsSchema.shape);

export type ListingFilterParams = z.infer<typeof listingFilterParamsSchema>;

export const boundsParamsSchema = z.object({
  bounds_north: z.coerce.number(),
  bounds_east: z.coerce.number(),
  bounds_south: z.coerce.number(),
  bounds_west: z.coerce.number()
});

export type BoundsParams = z.infer<typeof boundsParamsSchema>;
