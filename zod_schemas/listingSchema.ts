import { z } from "zod";

export const listingAddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string()
});

export type ListingAddress = z.infer<typeof listingAddressSchema>;
