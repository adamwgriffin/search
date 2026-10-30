import type { ToObjectOptions } from "mongoose";

// Serializes documents the way the API has always returned them: with a string
// `id` instead of `_id` and without Mongoose's `__v` version key.
export const toJSONOptions: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret: Record<string, unknown>) {
    delete ret._id;
    return ret;
  }
};
