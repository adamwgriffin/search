import { z } from "zod";

// We want to reuse this schema with others but you can't extend objects that use refine()
// (https://github.com/colinhacks/zod/issues/454), so we're separating out the schema and arguments for refine(). Any
// schemas that want to reuse this will need to extend/merge sharedGeocodeRequestSchema then manually call
// refine(...geocodeRequestRefinements) and apply the args in order to get the full geocode schema + refinements.
export const sharedGeocodeQuerySchema = z
  .object({
    address: z.string(),
    place_id: z.string()
  })
  .partial();

export const geocodeQueryRefinements: Parameters<
  (typeof sharedGeocodeQuerySchema)["refine"]
> = [
  ({ address, place_id }) => address || place_id,
  {
    path: ["address/place_id"],
    message: 'Either "address" or "place_id" are required'
  }
];

export const geocodeRequestQuerySchema = sharedGeocodeQuerySchema
  .strict()
  .refine(...geocodeQueryRefinements);

export const geocodeRequestSchema = z.object({
  query: geocodeRequestQuerySchema
});

export type GeocodeRequestQueryParams = z.infer<
  typeof geocodeRequestQuerySchema
>;

export type GeocodeRequest = z.infer<typeof geocodeRequestSchema>;
