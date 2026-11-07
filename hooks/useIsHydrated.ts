import { useSyncExternalStore } from "react";

// An empty subscribe function since "hydrated" status doesn't change once the
// app has hydrated on the client.
const subscribe = () => () => {};

/** Returns false on the server and during hydration, and true once the app has
hydrated (including on the first render of components mounted after that). Use
this to defer rendering anything that depends on browser-only APIs (e.g.,
document) or client-only state, without causing a hydration mismatch. */
export const useIsHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true, // Client value (always true once running on client)
    () => false // Server/Hydration value (always false initially)
  );
