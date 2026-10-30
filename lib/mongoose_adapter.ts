import type { HydratedDocument } from "mongoose";
import { isValidObjectId } from "mongoose";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken
} from "next-auth/adapters";
import type { IUser } from "@/models/UserModel";
import type { ISession } from "@/models/SessionModel";
import type { IVerificationToken } from "@/models/VerificationTokenModel";
import db from "@/lib/db";

function toAdapterUser(user: HydratedDocument<IUser>): AdapterUser {
  return {
    id: user.id,
    name: user.name,
    // next-auth types email as required, but some OAuth providers don't return
    // one
    email: user.email!,
    emailVerified: user.emailVerified ?? null,
    image: user.image
  };
}

function toAdapterSession(session: ISession): AdapterSession {
  return {
    sessionToken: session.sessionToken,
    userId: session.userId.toString(),
    expires: session.expires
  };
}

function toVerificationToken(
  verificationToken: IVerificationToken
): VerificationToken {
  return {
    identifier: verificationToken.identifier,
    token: verificationToken.token,
    expires: verificationToken.expires
  };
}

/**
 * next-auth adapter that stores auth data with the app's Mongoose
 * models so that auth shares the same connection as the rest of the app.
 *
 * The session methods are only used with the "database" session strategy, and
 * the verification token methods are only used by email providers.
 */
export function MongooseAdapter(): Adapter {
  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      return toAdapterUser(await db.User.create(data));
    },

    async getUser(id: string) {
      if (!isValidObjectId(id)) return null;
      const user = await db.User.findById(id);
      return user && toAdapterUser(user);
    },

    async getUserByEmail(email: string) {
      const user = await db.User.findOne({ email });
      return user && toAdapterUser(user);
    },

    async getUserByAccount({
      provider,
      providerAccountId
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const account = await db.Account.findOne({ provider, providerAccountId });
      if (!account) return null;
      const user = await db.User.findById(account.userId);
      return user && toAdapterUser(user);
    },

    async updateUser({ id, ...data }: Partial<AdapterUser> & { id: string }) {
      const user = await db.User.findByIdAndUpdate(id, data, {
        returnDocument: "after"
      });
      if (!user) throw new Error(`User ${id} not found`);
      return toAdapterUser(user);
    },

    async deleteUser(id: string) {
      await Promise.all([
        db.Account.deleteMany({ userId: id }),
        db.SavedSearch.deleteMany({ userId: id }),
        db.Session.deleteMany({ userId: id }),
        db.User.findByIdAndDelete(id)
      ]);
    },

    async linkAccount(account: AdapterAccount) {
      await db.Account.create(account);
    },

    async unlinkAccount({
      provider,
      providerAccountId
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      await db.Account.deleteOne({ provider, providerAccountId });
    },

    async createSession(data: AdapterSession) {
      return toAdapterSession(await db.Session.create(data));
    },

    async getSessionAndUser(sessionToken: string) {
      const session = await db.Session.findOne({ sessionToken });
      if (!session) return null;
      const user = await db.User.findById(session.userId);
      if (!user) return null;
      return {
        session: toAdapterSession(session),
        user: toAdapterUser(user)
      };
    },

    async updateSession({
      sessionToken,
      ...data
    }: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      const session = await db.Session.findOneAndUpdate(
        { sessionToken },
        data,
        { returnDocument: "after" }
      );
      return session && toAdapterSession(session);
    },

    async deleteSession(sessionToken: string) {
      await db.Session.deleteOne({ sessionToken });
    },

    async createVerificationToken(data: VerificationToken) {
      return toVerificationToken(await db.VerificationToken.create(data));
    },

    // Tokens can only be used once, so this deletes the token as it's returned
    async useVerificationToken({
      identifier,
      token
    }: Pick<VerificationToken, "identifier" | "token">) {
      const verificationToken = await db.VerificationToken.findOneAndDelete({
        identifier,
        token
      });
      return verificationToken && toVerificationToken(verificationToken);
    }
  };
}
