import type { MultiPolygon } from "@turf/turf";
import { Schema } from "mongoose";

const MultiPolygonSchema = new Schema<MultiPolygon>({
  type: {
    type: String,
    enum: ["MultiPolygon"],
    required: true
  },
  coordinates: {
    type: [[[[Number]]]],
    required: true
  }
});

export default MultiPolygonSchema;
