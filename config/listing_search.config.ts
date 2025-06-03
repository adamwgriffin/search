// used for mongodb's $project section to select the fields we want to return in the response
export const ListingResultProjectionFields = {
  status: 1,
  listPrice: 1,
  soldPrice: 1,
  listedDate: 1,
  beds: 1,
  baths: 1,
  sqft: 1,
  neighborhood: 1,
  description: 1,
  address: 1,
  latitude: { $arrayElemAt: ["$geometry.coordinates", 1] },
  longitude: { $arrayElemAt: ["$geometry.coordinates", 0] },
  rental: 1,
  photoGallery: 1,
  openHouses: 1,
  placeId: 1,
  slug: 1
};

// "distance" refers to the fieldname set in the  "distanceField" for the $geoNear query used in the findWithinRadius
// method
export const ListingRadiusResultProjectionFields = {
  ...ListingResultProjectionFields,
  distance: 1
};

export const ListingDetailResultProjectionFields = {
  ...ListingResultProjectionFields,
  propertyType: 1,
  yearBuilt: 1,
  soldDate: 1,
  propertyDetails: 1,
  lotSize: 1
};

export const DefaultMaxDistance = 1609.34; // 1 mile in meters

export const DefaultPageSize = 20;
