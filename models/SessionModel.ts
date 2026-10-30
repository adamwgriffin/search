import mongoose, { Schema, Types, model, type Model } from "mongoose";

// A database session for next-auth. Only used if the session strategy is
// changed from "jwt" to "database".
export interface ISession {
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

export const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, unique: true, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },
  expires: {
    type: Date,
    // next-auth checks the expiration itself, so this just has MongoDB clean
    // up expired sessions
    index: { expireAfterSeconds: 0 },
    required: true
  }
});

export default (mongoose.models.Session as Model<ISession>) ||
  model<ISession>("Session", SessionSchema);
