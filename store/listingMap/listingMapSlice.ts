import type { PayloadAction } from "@reduxjs/toolkit";
import type { GoogleMapState } from "../../components/map/GoogleMap/GoogleMap";
import { createSlice } from "@reduxjs/toolkit";
import { convertGeojsonCoordinatesToPolygonPaths } from "../../lib/polygon";
import {
  boundaryFoundForNewLocationSearch,
  noBoundaryFoundForNewLocationSearch
} from "../listingSearch/listingSearchSlice";
import { ListingMapState } from "./listingMapTypes";

export const initialState: ListingMapState = {
  boundaryActive: false,
  boundsNorth: 47.745274294284506,
  boundsEast: -122.38844700157635,
  boundsSouth: 47.610393280504454,
  boundsWest: -122.47058697044842,
  zoom: 12,
  // an array with one or more arrays of LatLngLiterals, e.g., [[{ lat: 47.228309, lng: -122.510645 },],], used for
  // Polygon paths
  geoLayerCoordinates: [],
  viewportBounds: null
};

export const listingMapSlice = createSlice({
  name: "listingMap",

  initialState,

  reducers: {
    setMapData: (state, action: PayloadAction<Partial<GoogleMapState>>) => {
      const { bounds, zoom } = action.payload;
      if (bounds) {
        const { north, east, south, west } = bounds;
        state.boundsNorth = north;
        state.boundsEast = east;
        state.boundsSouth = south;
        state.boundsWest = west;
      }
      if (zoom) {
        state.zoom = zoom;
      }
    },

    setBoundaryActive: (state, action: PayloadAction<boolean>) => {
      state.boundaryActive = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(boundaryFoundForNewLocationSearch, (state, action) => {
      state.geoLayerCoordinates = convertGeojsonCoordinatesToPolygonPaths(
        action.payload?.boundary?.geometry?.coordinates || []
      );
      state.viewportBounds = initialState.viewportBounds;
      state.boundaryActive = true;
    });

    builder.addCase(noBoundaryFoundForNewLocationSearch, (state, action) => {
      if (action.payload.viewport) {
        state.geoLayerCoordinates = initialState.geoLayerCoordinates;
        state.viewportBounds = action.payload.viewport;
        state.boundaryActive = false;
      } else {
        console.error(
          "No viewport found in noBoundaryFoundForNewLocationSearch action"
        );
      }
    });
  }
});

export const { setMapData, setBoundaryActive } = listingMapSlice.actions;

export default listingMapSlice.reducer;
