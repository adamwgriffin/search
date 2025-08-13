import { z } from "zod";

export const booleanEnum = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const featureFiltersSchema = z.object({
  waterfront: booleanEnum,
  view: booleanEnum,
  fireplace: booleanEnum,
  basement: booleanEnum,
  garage: booleanEnum,
  new_construction: booleanEnum,
  pool: booleanEnum,
  air_conditioning: booleanEnum
});

export type FeatureFilters = z.infer<typeof featureFiltersSchema>;
