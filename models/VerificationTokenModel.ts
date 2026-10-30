import mongoose, { Schema, model, type Model } from "mongoose";

// A one-time token for next-auth's email sign-in. Only used if an email
// provider is added.
export interface IVerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true },
  expires: {
    type: Date,
    // next-auth checks the expiration itself, so this just has MongoDB clean
    // up expired tokens
    index: { expireAfterSeconds: 0 },
    required: true
  }
});

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export default (mongoose.models.VerificationToken as Model<IVerificationToken>) ||
  model<IVerificationToken>("VerificationToken", VerificationTokenSchema);
