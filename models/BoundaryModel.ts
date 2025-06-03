import type { MultiPolygon } from "@turf/turf";
import mongoose, { Model, Schema, model } from "mongoose";
import MultiPolygonSchema from "./MultiPolygonSchema";

export const BoundaryTypes = [
  "neighborhood",
  "city",
  "zip_code",
  "county",
  "state",
  "country",
  "school_district",
  "school"
] as const;

export type BoundaryType = (typeof BoundaryTypes)[number];

export interface IBoundary {
  name: string;
  type: BoundaryType;
  geometry: MultiPolygon;
  placeId: string;
}

export interface BoundaryModel extends Model<IBoundary> {
  findBoundaries(
    lat: number,
    lng: number,
    boundaryType: string
  ): Promise<IBoundary[]>;
}

// Making placeId a required field because we don't really want to have to guess if a boundary matches a given
// request or not by just searching via `$geoIntersects`. If we were unable to geocode a boundary, or manually, map
// it to a specific string, then we just shouldn't use it at all.
export const BoundarySchema: Schema<IBoundary> = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: BoundaryTypes,
    required: true
  },
  geometry: {
    type: MultiPolygonSchema,
    // NOTE: it's very important that this index gets defined here, rather than on the coordinates in the
    // MultiPolygonSchema. putting them on the coordinates breaks things so that you can never create a record
    // successfully
    index: "2dsphere",
    required: true
  },
  placeId: {
    type: String,
    index: true,
    required: true
  }
});

BoundarySchema.statics.findBoundaries = async function (
  lat: number,
  lng: number,
  boundaryType: BoundaryType
) {
  return this.find({
    $and: [
      {
        geometry: {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            }
          }
        }
      },
      {
        type: boundaryType
      }
    ]
  });
};

export default (mongoose.models.Boundary as BoundaryModel) ||
  model<IBoundary, BoundaryModel>("Boundary", BoundarySchema);
