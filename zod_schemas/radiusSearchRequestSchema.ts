import { z } from "zod";
import { listingFilterParamsSchema } from "./listingSearchParamsSchema";
import { DefaultMaxDistance } from "../config";

export const radiusSearchQuerySchema = z
  .object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    max_distance: z.coerce.number().optional().default(DefaultMaxDistance)
  })
  .merge(listingFilterParamsSchema.partial())
  .strict();

export const radiusSearchRequestSchema = z.object({
  query: radiusSearchQuerySchema
});

export type RadiusSearchQueryParams = z.infer<typeof radiusSearchQuerySchema>;

export type RadiusSearchRequest = z.infer<typeof radiusSearchRequestSchema>;
