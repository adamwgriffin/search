import { backOff } from "exponential-backoff";
import type { ListingAddress } from "../zod_schemas/listingSchema";
import type {
  IListing,
  PhotoGalleryImage,
  PropertDetailsSection,
  PropertDetail,
  PropertyStatus,
  OpenHouse,
  PropertyType,
  ListingAmenities
} from "../models/ListingModel";
import type { Point, Polygon, MultiPolygon } from "@turf/turf";
import { bbox, randomPoint, booleanPointInPolygon } from "@turf/turf";
import { faker } from "@faker-js/faker";
import { subMonths, addHours, addMonths } from "date-fns";
import {
  reverseGeocode,
  addressComponentsToListingAddress,
  getNeighborhoodFromAddressComponents
} from "../lib/geocoder";
import {
  PropertyTypes,
  PropertyStatuses,
  RentalPropertyStatuses
} from "../models/ListingModel";
import { listingAddressHasRequiredFields } from "./listing_search_helpers";
import { galleryData } from "../data/seed_data/development/photo_galleries";

export type GeneratedListingGeocodeData = {
  address: ListingAddress;
  neighborhood: string;
  point: Point;
  placeId: string;
};

export type ListingData = Omit<IListing, "slug">;

export const RentalPropertyTypes = PropertyTypes.filter((t) => t !== "land");

export const AddressComponentAddressTemplate: ListingAddress = Object.freeze({
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: ""
});

export const randomPointsWithinPolygon = (
  polygon: Polygon | MultiPolygon,
  numPoints: number
) => {
  const points: Point[] = [];
  const bounds = bbox(polygon);
  while (points.length < numPoints) {
    const point = randomPoint(1, { bbox: bounds }).features[0];
    if (booleanPointInPolygon(point, polygon)) {
      points.push(point.geometry);
    }
  }
  return points;
};

export const roundDownToNearest = (num: number, nearest: number): number => {
  return Math.floor(num / nearest) * nearest;
};

export const randomNumberInRangeRounded = (
  min: number,
  max: number,
  roundTo: number
): number => roundDownToNearest(faker.number.int({ min, max }), roundTo);

export const addSoldData = (listing: ListingData): ListingData => {
  const today = new Date();
  const soldDate = faker.date.between({
    from: listing.listedDate,
    to: today
  });
  return {
    ...listing,
    soldPrice: randomNumberInRangeRounded(
      listing.listPrice - 5000,
      listing.listPrice + 5000,
      1000
    ),
    soldDate
  };
};

const getListPrice = (rental: boolean): number =>
  rental
    ? randomNumberInRangeRounded(1000, 5000, 1000)
    : randomNumberInRangeRounded(100000, 800000, 1000);

const getStatus = (rental: boolean): PropertyStatus =>
  faker.helpers.arrayElement(
    rental ? RentalPropertyStatuses : PropertyStatuses
  );

const getPropertyType = (rental: boolean) =>
  faker.helpers.arrayElement(rental ? RentalPropertyTypes : PropertyTypes);

const createPhotoGallery = (): PhotoGalleryImage[] => {
  const [galleryName, fileNames] = faker.helpers.objectEntry(galleryData);
  return fileNames.map((fileName) => {
    return {
      url: `/gallery/${galleryName}/${fileName}`,
      caption: titleCase(faker.lorem.words({ min: 4, max: 10 }))
    };
  });
};

const randomWordArray = (min: number, max: number) =>
  Array.from({ length: faker.number.int({ min, max }) }, () =>
    faker.lorem.word()
  );

const titleCase = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const generateRandomTitle = (min: number, max: number) =>
  randomWordArray(min, max)
    .map((w) => titleCase(w))
    .join(" ");

const createPropertyDetail = (): PropertDetail => ({
  name: generateRandomTitle(1, 3),
  details: randomWordArray(1, 6).map((w) => titleCase(w))
});

const createPropertDetailsSection = (): PropertDetailsSection => {
  const numberOfDetails = faker.number.int({ min: 2, max: 6 });
  return {
    name: generateRandomTitle(1, 3),
    description: titleCase(faker.lorem.words({ min: 4, max: 6 })),
    details: Array.from({ length: numberOfDetails }, () => {
      return createPropertyDetail();
    })
  };
};

const createPropertyDetails = (
  numberOfSections: number
): PropertDetailsSection[] => {
  return Array.from({ length: numberOfSections }, () => {
    return createPropertDetailsSection();
  });
};

const createOpenHouse = (listedDate: Date): OpenHouse => {
  const start = faker.date.between({
    from: listedDate,
    to: addMonths(listedDate, 4)
  });
  const hoursToAdd = faker.number.int({ min: 1, max: 6 });
  const end = addHours(start, hoursToAdd);
  return {
    start,
    end,
    comments: faker.lorem.sentence()
  };
};

const createOpenHouses = (
  numberOfOpenHouses: number,
  listedDate: Date
): OpenHouse[] => {
  const openHouses = Array.from({ length: numberOfOpenHouses }, () => {
    return createOpenHouse(listedDate);
  });
  return openHouses.sort((a, b) => a.start.getTime() - b.start.getTime());
};

const createAmenities = (propertyType: PropertyType): ListingAmenities => {
  if (propertyType === "land") {
    return {
      waterfront: faker.datatype.boolean({ probability: 0.2 }),
      view: faker.datatype.boolean({ probability: 0.3 }),
      fireplace: false,
      basement: false,
      garage: false,
      pool: false,
      airConditioning: false
    };
  }
  return {
    waterfront: faker.datatype.boolean({ probability: 0.3 }),
    view: faker.datatype.boolean({ probability: 0.5 }),
    fireplace: faker.datatype.boolean({ probability: 0.7 }),
    basement: faker.datatype.boolean({ probability: 0.8 }),
    garage: faker.datatype.boolean({ probability: 0.9 }),
    pool: faker.datatype.boolean({ probability: 0.2 }),
    airConditioning: faker.datatype.boolean({ probability: 0.3 })
  };
};

const createBedsAndBaths = (propertyType: PropertyType) => {
  switch (propertyType) {
    case "land":
      return {
        beds: 0,
        baths: 0
      };
    case "condo":
      return {
        beds: faker.number.int({ min: 1, max: 3 }),
        baths: faker.number.int({ min: 1, max: 2 })
      };
    case "multi-family":
      return {
        beds: faker.number.int({ min: 3, max: 6 }),
        baths: faker.number.int({ min: 2, max: 4 })
      };
    default:
      return {
        beds: faker.number.int({ min: 2, max: 5 }),
        baths: faker.number.int({ min: 1, max: 4 })
      };
  }
};

const createNewConstruction = (propertyType: PropertyType) =>
  propertyType === "land"
    ? false
    : faker.datatype.boolean({ probability: 0.4 });

export const createRandomListingModel = (
  listingGeocodeData: GeneratedListingGeocodeData
): ListingData => {
  const { address, neighborhood, point, placeId } = listingGeocodeData;
  const today = new Date();
  const rental = faker.datatype.boolean({ probability: 0.4 });
  const propertyType = getPropertyType(rental);
  const listing: ListingData = {
    listPrice: getListPrice(rental),
    listedDate: faker.date.between({
      from: subMonths(today, 6),
      to: today
    }),
    address: { ...AddressComponentAddressTemplate, ...address },
    geometry: point,
    placeId,
    neighborhood,
    propertyType,
    status: getStatus(rental),
    description: faker.lorem.sentences({ min: 1, max: 3 }),
    ...createBedsAndBaths(propertyType),
    sqft: randomNumberInRangeRounded(1000, 5000, 100),
    lotSize: randomNumberInRangeRounded(1000, 7500, 100),
    yearBuilt: faker.number.int({ min: 1910, max: today.getFullYear() }),
    newConstruction: createNewConstruction(propertyType),
    ...createAmenities(propertyType),
    photoGallery: createPhotoGallery(),
    propertyDetails: createPropertyDetails(
      faker.number.int({ min: 4, max: 12 })
    )
  };
  if (rental) {
    listing.rental = true;
    return listing;
  }
  if (listing.status === "sold") {
    return addSoldData(listing);
  }
  if (listing.status === "active" && !listing.rental) {
    listing.openHouses = createOpenHouses(
      faker.number.int({ min: 1, max: 5 }),
      listing.listedDate
    );
  }
  return listing;
};

const reverseGeocodeWithExponentialBackoff = async (point: Point) => {
  try {
    const res = await backOff(
      () => reverseGeocode(point.coordinates[1], point.coordinates[0]),
      {
        retry(error: unknown, attemptNumber) {
          const errorMessage =
            error instanceof Error ? `"${error.message}"` : "";
          console.error(
            `Encountered error during reverse geocode ${errorMessage},`,
            `retrying request, attempt next number ${attemptNumber}`
          );
          return true;
        }
      }
    );
    return res.data.results[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? `"${error.message}"` : "";
    throw new Error(
      "Unabled to make reverse geocode request after multiple attempts" +
        errorMessage
    );
  }
};

export const getGeocodeDataForPoint = async (
  point: Point
): Promise<GeneratedListingGeocodeData | undefined> => {
  const geocoderResult = await reverseGeocodeWithExponentialBackoff(point);
  if (!geocoderResult?.address_components) {
    console.warn(
      `No address_components found for reverseGeocode of ${point.coordinates}. Skipping.`
    );
    return;
  }
  const neighborhood = getNeighborhoodFromAddressComponents(
    geocoderResult.address_components
  );
  if (neighborhood === "" || neighborhood === undefined) {
    console.warn(
      `No neighborhood found for reverseGeocode of ${point.coordinates}. Skipping.`
    );
    return;
  }
  const address = addressComponentsToListingAddress(
    geocoderResult.address_components
  );
  if (!listingAddressHasRequiredFields(address)) {
    console.warn(
      `All required fields for address ${address.line1} are not present. Skipping.`
    );
    return;
  }
  console.debug(`Got valid geocode data from point for ${address.line1}`);
  return {
    address,
    neighborhood,
    point,
    placeId: geocoderResult.place_id
  };
};

export const generateRandomGeospatialDataForPoly = async (
  polygon: Polygon | MultiPolygon,
  amount: number
) => {
  const points = randomPointsWithinPolygon(polygon, amount);
  const listingGeocodeData: GeneratedListingGeocodeData[] = [];
  // We are doing these geocode requests sequentially because doing them in parallel can cause lots of rate limit errors
  for (const point of points) {
    const data = await getGeocodeDataForPoint(point);
    // For some reason they way we do this generates a lot of duplicate place_ids,
    // even though the coordinates are technically different, so we're de-duping
    // them here.
    const alreadyExists = listingGeocodeData.some(
      (d) => d.placeId === data?.placeId
    );
    if (data && !alreadyExists) {
      listingGeocodeData.push(data);
    }
  }
  return listingGeocodeData;
};
