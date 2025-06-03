import type { MultiPolygon, Point, Polygon } from "@turf/turf";
import type { GeocodeBoundaryQueryParams } from "../zod_schemas/geocodeBoundarySearchSchema";
import type {
  ListingResultWithSelectedFields,
  ListingRadiusResultWithSelectedFields,
  ListingDetailResultWithSelectedFields
} from "../types/listing_search_response_types";
import type { ListingAddress } from "../zod_schemas/listingSchema";
import type { PaginationParams } from "../zod_schemas/listingSearchParamsSchema";
import mongoose, { Model, ProjectionFields, Schema, model } from "mongoose";
import slugify from "slugify";
import PointSchema from "./PointSchema";
import {
  ListingResultProjectionFields,
  ListingRadiusResultProjectionFields,
  ListingDetailResultProjectionFields
} from "../config";
import {
  buildFilterQueries,
  buildfilterQueriesObject,
  listingSortQuery
} from "../lib/listing_query_helpers";

export const PropertyTypes = [
  "single-family",
  "condo",
  "townhouse",
  "manufactured",
  "land",
  "multi-family"
] as const;

export const PropertyStatuses = ["active", "pending", "sold"] as const;

export const RentalPropertyStatuses = ["active", "rented"] as const;

export const AllPropertyStatuses = [
  ...PropertyStatuses,
  ...RentalPropertyStatuses
];

export type PropertyType = (typeof PropertyTypes)[number];

export type PropertyStatus = (typeof AllPropertyStatuses)[number];

export interface PhotoGalleryImage {
  url: string;
  caption?: string;
}

export interface PropertDetail {
  name: string;
  details: string[];
}

export interface PropertDetailsSection {
  name: string;
  description?: string;
  details: PropertDetail[];
}

export interface OpenHouse {
  start: Date;
  end: Date;
  comments?: string;
}

export interface ListingAmenities {
  waterfront?: boolean;
  view?: boolean;
  fireplace?: boolean;
  basement?: boolean;
  garage?: boolean;
  newConstruction?: boolean;
  pool?: boolean;
  airConditioning?: boolean;
}

export interface IListing extends ListingAmenities {
  listPrice: number;
  soldPrice?: number;
  listedDate: Date;
  soldDate?: Date;
  address: ListingAddress;
  slug: string;
  geometry: Point;
  placeId?: string;
  neighborhood: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  description?: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  rental?: boolean;
  photoGallery?: PhotoGalleryImage[];
  propertyDetails?: PropertDetailsSection[];
  openHouses?: OpenHouse[];
}

export interface IListingModel extends Model<IListing> {
  findWithinBounds<T = ListingResultWithSelectedFields>(
    boundaryGeometry: Polygon | MultiPolygon,
    query: GeocodeBoundaryQueryParams,
    pagination: PaginationParams,
    fields?: ProjectionFields<T>
  ): Promise<ListingSearchAggregateResult<T>>;

  findWithinRadius<T = ListingRadiusResultWithSelectedFields>(
    lat: number,
    lng: number,
    maxDistance: number,
    query: GeocodeBoundaryQueryParams,
    pagination: PaginationParams,
    fields?: ProjectionFields<T>
  ): Promise<ListingSearchAggregateResult<T>>;

  findByPlaceIdOrAddress<T = ListingDetailResultWithSelectedFields>(
    placeId: string,
    address: Partial<ListingAddress>,
    fields?: ProjectionFields<T>
  ): Promise<T>;
}

export type ListingSearchAggregateResult<T> = {
  metadata: { numberAvailable: number }[];
  listings: Array<T>;
}[];

const ListingSchema = new Schema<IListing, IListingModel>({
  listPrice: {
    type: Number,
    required: true,
    index: true
  },
  soldPrice: {
    type: Number,
    required: false,
    index: true
  },
  listedDate: {
    type: Date,
    required: true,
    index: true
  },
  soldDate: {
    type: Date,
    required: false,
    index: true
  },
  address: {
    line1: {
      type: String,
      required: true,
      minlength: 1
    },
    line2: String,
    city: {
      type: String,
      required: true,
      minlength: 1
    },
    state: {
      type: String,
      required: true,
      minlength: 1
    },
    zip: {
      type: String,
      required: true,
      minlength: 1
    }
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  geometry: {
    type: PointSchema,
    index: "2dsphere",
    required: true
  },
  placeId: {
    type: String,
    index: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: PropertyTypes,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: AllPropertyStatuses,
    default: "active",
    index: true
  },
  description: String,
  beds: {
    type: Number,
    required: true,
    index: true
  },
  baths: {
    type: Number,
    required: true,
    index: true
  },
  sqft: {
    type: Number,
    required: true
  },
  lotSize: {
    type: Number,
    required: true
  },
  yearBuilt: {
    type: Number,
    required: true
  },
  rental: {
    type: Boolean,
    required: false,
    index: true
  },
  waterfront: {
    type: Boolean,
    default: false
  },
  view: {
    type: Boolean,
    default: false
  },
  fireplace: {
    type: Boolean,
    default: false
  },
  basement: {
    type: Boolean,
    default: false
  },
  garage: {
    type: Boolean,
    default: false
  },
  newConstruction: {
    type: Boolean,
    default: false
  },
  pool: {
    type: Boolean,
    default: false
  },
  airConditioning: {
    type: Boolean,
    default: false
  },
  photoGallery: {
    type: [
      {
        url: { type: String, required: true },
        caption: { type: String }
      }
    ],
    required: false,
    default: []
  },
  propertyDetails: {
    type: [
      {
        name: { type: String, required: true },
        description: { type: String },
        details: [
          {
            name: { type: String, required: true },
            details: { type: [String], required: true }
          }
        ]
      }
    ],
    required: false,
    default: []
  },
  openHouses: {
    type: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        comments: { type: String }
      }
    ],
    default: [],
    required: false
  }
});

ListingSchema.pre("save", async function (next) {
  if (this.isModified("address") || !this.slug) {
    const address = Object.values(this.address).filter(Boolean).join(" ");
    const baseSlug = slugify(address, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;
    while (await mongoose.models.Listing.exists({ slug })) {
      count += 1;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
  }
  next();
});

/**
 * Find a listing by placeId first. If that fails, try address instead.
 */
ListingSchema.statics.findByPlaceIdOrAddress = async function <
  T = ListingDetailResultWithSelectedFields
>(
  this: IListingModel,
  placeId: IListing["placeId"],
  address: ListingAddress,
  fields: ProjectionFields<T> = ListingDetailResultProjectionFields
): Promise<T | null> {
  const addressQuery: { [index: string]: string } = {};
  for (const k in address) {
    const v = address[k as keyof typeof address];
    if (typeof v === "string") {
      addressQuery[`address.${k}`] = v;
    }
  }
  return this.findOne<T>({ $or: [{ placeId }, addressQuery] }, fields);
};

ListingSchema.statics.findWithinBounds = async function <
  T = ListingResultWithSelectedFields
>(
  this: IListingModel,
  boundaryGeometry: Polygon | MultiPolygon,
  query: GeocodeBoundaryQueryParams,
  { page_size, page_index }: PaginationParams,
  fields: ProjectionFields<T> = ListingResultProjectionFields
): Promise<ListingSearchAggregateResult<T>> {
  return this.aggregate([
    {
      $match: {
        $and: [
          {
            geometry: {
              $geoWithin: {
                $geometry: boundaryGeometry
              }
            }
          },
          ...buildFilterQueries(query)
        ]
      }
    },
    { $sort: listingSortQuery(query) },
    // using the aggregation pipline in combination with $facet allows us to get the total number of documents that
    // match the query when using $skip & $limit for pagination. it allows us to count the total results from the
    // $match stage before they go through the $skip/$limit stages that will reduce the number of results returned.
    {
      $facet: {
        metadata: [
          // this part counts the total. "numberAvailable" is just a name for the field
          { $count: "numberAvailable" }
        ],
        listings: [
          // $skip allows us to move ahead to each page in the results set by skipping the previous page results we
          // have already seen, while $limit only returns the amount per page. together they create a slice of the
          // result set represented as a "page"
          { $skip: page_index * page_size },
          { $limit: page_size },
          { $project: fields }
        ]
      }
    }
  ]);
};

ListingSchema.statics.findWithinRadius = async function <
  T = ListingRadiusResultWithSelectedFields
>(
  this: IListingModel,
  lat: number,
  lng: number,
  maxDistance: number,
  query: GeocodeBoundaryQueryParams,
  { page_size, page_index }: PaginationParams,
  fields: ProjectionFields<T> = ListingRadiusResultProjectionFields
): Promise<ListingSearchAggregateResult<T>> {
  return this.aggregate([
    // $geoNear doesn't go inside of $match like the other queries because it is aggregation pipeline stage, not an
    // aggregation operator. also, you can only use $geoNear as the first stage of a pipeline.
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat]
        },
        maxDistance: maxDistance,
        spherical: true,
        distanceField: "distance"
      }
    },
    {
      $match: buildfilterQueriesObject(query)
    },
    { $sort: listingSortQuery(query) },
    {
      $facet: {
        metadata: [{ $count: "numberAvailable" }],
        listings: [
          { $skip: page_index * page_size },
          { $limit: page_size },
          {
            $project: fields
          }
        ]
      }
    }
  ]);
};

export default (mongoose.models.Listing as IListingModel) ||
  model<IListing, IListingModel>("Listing", ListingSchema);
