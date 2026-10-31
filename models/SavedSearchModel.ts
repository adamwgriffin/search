import mongoose, { Schema, Types, model, type Model } from "mongoose";
import type { SearchState } from "@/zod_schemas/searchStateSchema";
import { toJSONOptions } from "./schemaOptions";

export interface ISavedSearch {
  userId: Types.ObjectId;
  name: string;
  messageCadence: number;
  searchState: SearchState;
  createdAt: Date;
  updatedAt: Date;
}

export const SavedSearchSchema = new Schema<ISavedSearch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },
    name: { type: String, required: true },
    messageCadence: { type: Number, required: true },
    searchState: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true, toJSON: toJSONOptions }
);

export default (mongoose.models.SavedSearch as Model<ISavedSearch>) ||
  model<ISavedSearch>("SavedSearch", SavedSearchSchema);
