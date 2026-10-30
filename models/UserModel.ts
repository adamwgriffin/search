import mongoose, { Schema, Types, model, type Model } from "mongoose";
import { toJSONOptions } from "./schemaOptions";

export interface IUser {
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  hashedPassword?: string;
  favoriteIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      // Some OAuth providers don't return an email, so allow multiple users
      // without one
      sparse: true
    },
    emailVerified: Date,
    image: String,
    hashedPassword: {
      type: String,
      select: false
    },
    favoriteIds: [{ type: Schema.Types.ObjectId, ref: "Listing" }]
  },
  { timestamps: true, toJSON: toJSONOptions }
);

export default (mongoose.models.User as Model<IUser>) ||
  model<IUser>("User", UserSchema);
