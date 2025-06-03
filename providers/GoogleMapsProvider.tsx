"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import type { Dispatch } from "react";
import type { LoaderOptions, Libraries } from "@googlemaps/js-api-loader";
import { Loader } from "@googlemaps/js-api-loader";
import {
  DefaultGoogleMapsLoaderOptions,
  DefaultGoogleMapsLibraries
} from "../config/googleMapsOptions";

export type GoogleMapsContextInterface = {
  googleLoaded: boolean;
  googleMap: google.maps.Map | null;
  setGoogleMap: Dispatch<google.maps.Map>;
};

export type GoogleMapsProviderProps = {
  children: ReactNode;
  loaderOptions?: LoaderOptions;
  libraries?: Libraries;
};

const GoogleMapsContext = createContext<GoogleMapsContextInterface>({
  googleLoaded: false,
  googleMap: null,
  setGoogleMap: () => {}
});

// Custom hook to use with GoogleMapsProvider
export const useGoogleMaps = () => useContext(GoogleMapsContext);

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  loaderOptions = DefaultGoogleMapsLoaderOptions,
  libraries = DefaultGoogleMapsLibraries,
  children
}) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  // This will be set later by the <GoogleMap> component since it generates the
  // div we need to create the map instance
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);

  // There is no npm module for the Google Maps API. You have to load it via a
  // script tag. The Loader from @googlemaps/js-api-loader just creates a nice
  // interface that you can use to create the script tag dynamically, and
  // returns a promise that will resolve once its loaded. This way you can
  // execute whatever code depends on the API after the promise resolves.
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      const loader = new Loader(loaderOptions);
      await Promise.all(libraries.map((l) => loader.importLibrary(l)));
      setGoogleLoaded(true);
    };
    initializeGoogleMaps().catch((error) =>
      console.error("Unable to load Google Maps API", error)
    );
  }, [libraries, loaderOptions]);

  // Passing the specific data we want as an object to the value prop in the
  // Provider component is what makes it available to child components that use
  // the context
  const value = { googleLoaded, googleMap, setGoogleMap };
  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsProvider;
