import { Listing } from '../../types/listing_types';

export const testListing: Listing = {
  _id: "67551812abee9fa84021f954",
  propertyType: "single-family",
  listPrice: 100_000,
  lotSize: 2_000,
  beds: 3,
  baths: 2,
  sqft: 1_000,
  status: "active",
  listedDate: new Date(),
  neighborhood: "Fremont",
  description: "Tondeo thorax amiculum angustus.",
  address: {
    line1: "123 Test Lane",
    city: "Seattle",
    state: "WA",
    zip: "98119"
  },
  slug: "123_test_lane_seattle_wa_98119",
  latitude: 47.65388837211665,
  longitude: -122.35601516553109,
  openHouses: []
};