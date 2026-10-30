import mongoose, { type ConnectOptions } from "mongoose";
import { attachDatabasePool } from "@vercel/functions";
import Listing from "@/models/ListingModel";
import Boundary from "@/models/BoundaryModel";
import User from "@/models/UserModel";
import Account from "@/models/AccountModel";
import SavedSearch from "@/models/SavedSearchModel";
import Session from "@/models/SessionModel";
import VerificationToken from "@/models/VerificationTokenModel";

export const DefaultConnectOptions: ConnectOptions = {
  // Fail fast if the database can't be reached instead of waiting the default
  // 30 seconds
  serverSelectionTimeoutMS: 5000,
  // Each function instance gets its own pool. The default of 100 would allow
  // just a few instances to exhaust the free Atlas tier's limit of 500
  // connections.
  maxPoolSize: 10,
  // Close connections that sit idle so they don't pile up across function
  // instances. attachDatabasePool() also relies on this to know how long to
  // keep the function alive after a query.
  maxIdleTimeMS: 5000
};

/**
 * Singleton client for accessing the app's Mongoose models.
 *
 * Accessing a model through the client starts the database connection if it
 * hasn't been started yet, so callers never need to connect manually. Queries
 * made before the connection is open are buffered by Mongoose until it opens.
 *
 * Use the default `db` export from this module, which is created from the
 * `MONGODB_URI` environment variable with {@link DefaultConnectOptions} when
 * the module is first imported.
 *
 * @example
 * import db from "@/lib/db";
 *
 * const listing = await db.Listing.findOne({ slug });
 */
export class Database {
  private uri: string;
  private options: ConnectOptions;
  private connection: Promise<typeof mongoose> | undefined;

  private constructor(uri: string, options: ConnectOptions = {}) {
    this.uri = uri;
    this.options = { ...DefaultConnectOptions, ...options };
  }

  /** Returns the single shared instance, creating it on the first call. The
  instance is cached on globalThis so it survives hot reloads in development. */
  static getInstance(uri: string, options?: ConnectOptions) {
    if (!globalThis.db) {
      globalThis.db = new Database(uri, options);
    } else if (globalThis.db.uri !== uri) {
      // Every instance would share Mongoose's default connection, so a second
      // database can't be supported
      throw new Error("Database has already been initialized with another URI");
    }
    return globalThis.db;
  }

  /** Starts the connection if it hasn't been started yet. */
  connect() {
    if (!this.connection) {
      const connection = mongoose.connect(this.uri, this.options);
      this.connection = connection;
      // Keeps the function instance alive long enough on Vercel for idle
      // connections to be closed before the instance is suspended. This is a
      // no-op outside of Vercel.
      attachDatabasePool(mongoose.connection.getClient());
      connection.catch((error) => {
        // Clear the cache so the next model access retries the connection
        this.connection = undefined;
        console.error("MongoDB connection error:", error);
      });
    }
    return this.connection;
  }

  /** Ensures the connection has been started before handing out a model. */
  private getModel<T>(model: T) {
    this.connect();
    return model;
  }

  get Listing() {
    return this.getModel(Listing);
  }

  get Boundary() {
    return this.getModel(Boundary);
  }

  get User() {
    return this.getModel(User);
  }

  get Account() {
    return this.getModel(Account);
  }

  get SavedSearch() {
    return this.getModel(SavedSearch);
  }

  get Session() {
    return this.getModel(Session);
  }

  get VerificationToken() {
    return this.getModel(VerificationToken);
  }
}

declare global {
  // Cached across hot reloads in development so we don't open a new connection
  // every time a module changes. This must be a `var` and not a `let / const`.
  var db: Database | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const db = Database.getInstance(process.env.MONGODB_URI);

export default db;
