import type {
  AddressComponent,
  GeocodeRequest,
  PlaceDetailsRequest,
  ReverseGeocodeResponse
} from "@googlemaps/google-maps-services-js";
import { Client, AddressType } from "@googlemaps/google-maps-services-js";
import type { BoundaryType } from "../models/BoundaryModel";
import type { ListingAddress } from "../zod_schemas/listingSchema";

export type GeocodeRequestParams = Omit<GeocodeRequest["params"], "key">;

export const AddressTypeToBoundaryTypeMapping: Map<AddressType, BoundaryType> =
  new Map([
    [AddressType.country, "country"],
    [AddressType.administrative_area_level_1, "state"],
    [AddressType.administrative_area_level_2, "county"],
    [AddressType.postal_code, "zip_code"],
    [AddressType.locality, "city"],
    [AddressType.neighborhood, "neighborhood"]
  ]);

/**
 * Address types that usually belong to a residence, as opposed to city/state/zip types
 */
export const GeocodeResultListingAddressTypes: readonly AddressType[] =
  Object.freeze([
    AddressType.street_address,
    AddressType.premise,
    AddressType.subpremise
  ]);

/**
 * Converts a geocoder result type name into the name we use internally for the type field in a Boundary record
 */
export const getBoundaryTypeFromGeocoderAddressTypes = (
  types: AddressType[]
): BoundaryType | undefined => {
  if (types.includes(AddressType.school)) {
    return "school";
  }
  return AddressTypeToBoundaryTypeMapping.get(types[0]);
};

/**
 * Maps all the different types in an AddressComponent.types array to a specific address field that we use for a Listing
 * record.
 */
const AddressComponentMapping = new Map<
  "street_number" | "street_address" | "city" | "state" | "zip",
  AddressComponent["types"]
>([
  ["street_number", [AddressType.street_number]],
  ["street_address", [AddressType.street_address, AddressType.route]],
  [
    "city",
    [
      AddressType.locality,
      AddressType.sublocality,
      AddressType.sublocality_level_1,
      AddressType.sublocality_level_2,
      AddressType.sublocality_level_3,
      AddressType.sublocality_level_4
    ]
  ],
  [
    "state",
    [
      AddressType.administrative_area_level_1,
      AddressType.administrative_area_level_2,
      AddressType.administrative_area_level_3,
      AddressType.administrative_area_level_4,
      AddressType.administrative_area_level_5
    ]
  ],
  ["zip", [AddressType.postal_code]]
]);

const googleMapsClient = new Client({});

export const geocode = async (params: GeocodeRequestParams) => {
  return googleMapsClient.geocode({
    params: { ...params, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! }
  });
};

export const reverseGeocode = async (
  lat: number,
  lng: number,
  result_type: AddressType[] = [AddressType.street_address]
): Promise<ReverseGeocodeResponse> => {
  const response = await googleMapsClient.reverseGeocode({
    params: {
      latlng: `${lat},${lng}`,
      result_type,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    }
  });
  if (response.status < 200 || response.status > 299) {
    throw new Error("Failed to fetch address");
  }
  return response;
};

export const getPlaceDetails = async (
  params: Omit<PlaceDetailsRequest["params"], "key">
) => {
  return googleMapsClient.placeDetails({
    params: { ...params, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! }
  });
};

/**
 * Convert the address fields from a geocode result into the fields we use for a Listing address in the database
 */
export const addressComponentsToListingAddress = (
  addressComponents: AddressComponent[]
) => {
  const address: ListingAddress = {
    line1: "",
    city: "",
    state: "",
    zip: ""
  };
  let street_number = "";
  let street_address = "";

  addressComponents.forEach((component) => {
    for (const [field, types] of AddressComponentMapping) {
      if (!types.includes(component.types[0])) {
        continue;
      }
      if (field === "street_number") {
        street_number = component.long_name;
      } else if (field === "street_address") {
        street_address = component.long_name;
      } else {
        address[field] = component.long_name;
      }
    }
  });

  address.line1 = [street_number, street_address].join(" ").trim();

  return address;
};

export const getNeighborhoodFromAddressComponents = (
  addressComponents: AddressComponent[]
) => {
  return addressComponents.find((component) =>
    component.types.includes(AddressType.neighborhood)
  )?.long_name;
};

export const isListingAddressType = (types: AddressType[]) =>
  GeocodeResultListingAddressTypes.some((t) => types.includes(t));

export const getGeocodeParamsFromQuery = ({
  place_id,
  address
}: GeocodeRequestParams) => (place_id ? { place_id } : { address });
