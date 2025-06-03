import type { AppState } from "..";
import type { ListingMapStateForMap } from "./listingMapTypes";
import { createSelector } from "@reduxjs/toolkit";
import pick from "lodash/pick";
import omit from "lodash/omit";

export const selectListingMap = (state: AppState) => state.listingMap;

export const selectViewportBounds = createSelector(
  [selectListingMap],
  (listingMap) => listingMap.viewportBounds
);

export const selectMapState = createSelector(
  [selectListingMap],
  (listingMap): ListingMapStateForMap => {
    return omit(listingMap, [
      "boundsNorth",
      "boundsEast",
      "boundsSouth",
      "boundsWest"
    ]);
  }
);

export const selectBounds = createSelector([selectListingMap], (listingMap) => {
  return pick(listingMap, [
    "boundsNorth",
    "boundsEast",
    "boundsSouth",
    "boundsWest"
  ]);
});
