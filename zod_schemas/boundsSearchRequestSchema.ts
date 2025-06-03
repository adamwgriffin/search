import { z } from "zod";
import {
  boundsParamsSchema,
  listingFilterParamsSchema
} from "./listingSearchParamsSchema";

export const boundsSearchQuerySchema = boundsParamsSchema
  .merge(listingFilterParamsSchema.partial())
  .strict();

export const boundsSearchRequestSchema = z.object({
  query: boundsSearchQuerySchema
});

export type BoundsSearchQueryParams = z.infer<typeof boundsSearchQuerySchema>;

export type BoundsSearchRequest = z.infer<typeof boundsSearchRequestSchema>;
