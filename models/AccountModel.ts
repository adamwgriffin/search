import mongoose, { Schema, Types, model, type Model } from "mongoose";

// An OAuth account linked to a user. The field names match what next-auth
// passes to the adapter's linkAccount() method.
export interface IAccount {
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export const AccountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true
  },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String
});

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default (mongoose.models.Account as Model<IAccount>) ||
  model<IAccount>("Account", AccountSchema);
