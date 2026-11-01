import { useSyncExternalStore } from "react";

// An empty subscribe function since "mounted" status doesn't change once the
// component is alive on the client.
const subscribe = () => () => {};

/** Returns false on the server and during hydration, and true once rendering on
the client. Use this to defer rendering anything that depends on browser-only
APIs (e.g., document) or client-only state, without causing a hydration
mismatch. */
export const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true, // Client value (always true once running on client)
    () => false // Server/Hydration value (always false initially)
  );
