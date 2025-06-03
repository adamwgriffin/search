"use client";

import type { NextPage } from "next";
import type { Listing } from "../../../types/listing_types";
import { useEffect, useState, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider";
import ListingMarkerContent from "../ListingMarkerContent/ListingMarkerContent";
import { listingLocationToLatLngLiteral } from "../../../lib/listing_helpers";
import { objectsValuesEqual } from "../../../lib";

export interface ListingMarkerProps {
  listing: Listing;
  highlighted?: boolean;
  zIndex: number;
  authenticaticated: boolean;
  onMouseEnter?: (listingid: string) => void;
  onMouseLeave?: () => void;
  onClick?: (listingSlug: string) => void;
}

const ListingMarker: NextPage<ListingMarkerProps> = ({
  listing,
  highlighted,
  zIndex,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  const { googleMap } = useGoogleMaps();
  const [markerContainer, setMarkerContainer] = useState<HTMLDivElement | null>(
    null
  );

  const createMarker = useCallback(
    (
      markerContainer: HTMLElement
    ): google.maps.marker.AdvancedMarkerElement => {
      return new google.maps.marker.AdvancedMarkerElement({
        map: googleMap,
        position: listingLocationToLatLngLiteral(listing),
        content: markerContainer
      });
    },
    [googleMap, listing]
  );

  const addEventListenersToMarker = useCallback(
    (
      marker: google.maps.marker.AdvancedMarkerElement
    ): { handleMouseEnter: () => void; handleMouseLeave: () => void } => {
      marker.addListener("click", () => onClick?.(listing.slug));
      // there are currently only a few events that AdvancedMarkerElement supports, so we have to attach events to the
      // element itself for others to work. Note: marker.element is not the the markerContainer we created
      const markerElement = marker.element;
      markerElement.style.zIndex = highlighted ? "10000" : zIndex.toString();
      const handleMouseEnter = () => {
        markerElement.style.zIndex = "10000";
        onMouseEnter?.(listing._id);
      };
      const handleMouseLeave = () => {
        markerElement.style.zIndex = zIndex.toString();
        onMouseLeave?.();
      };
      markerElement.addEventListener("mouseenter", handleMouseEnter);
      markerElement.addEventListener("mouseleave", handleMouseLeave);
      return { handleMouseEnter, handleMouseLeave };
    },
    [highlighted, listing, onClick, onMouseEnter, onMouseLeave, zIndex]
  );

  useEffect(() => {
    if (!googleMap) return;
    const markerContainer = document.createElement("div");
    const marker = createMarker(markerContainer);
    const { handleMouseEnter, handleMouseLeave } =
      addEventListenersToMarker(marker);
    setMarkerContainer(markerContainer);
    // Clean up by removing event listeners, removing the marker from the map and removing the div element we created
    // from the DOM. Not sure if all of this is strictly necessary. We're doing it for now, just in case.
    return () => {
      marker.element.removeEventListener("mouseenter", handleMouseEnter);
      marker.element.removeEventListener("mouseleave", handleMouseLeave);
      marker.map = null;
      markerContainer.remove();
    };
  }, [addEventListenersToMarker, createMarker, googleMap]);

  if (markerContainer === null) return;

  return createPortal(
    <ListingMarkerContent
      listing={listing}
      link={`/listing/${listing.slug}`}
      highlighted={highlighted}
    />,
    markerContainer
  );
};

// Don't re-render the marker if all of these conditions are true
const propsAreEqual = (
  prevProps: Readonly<ListingMarkerProps>,
  nextProps: Readonly<ListingMarkerProps>
) => {
  return objectsValuesEqual(prevProps, nextProps, [
    "listing._id",
    "listing.latitude",
    "listing.longitude",
    "highlighted",
    // we need to re-render every time the authentication status changes, otherwise the favorite button will not
    // re-render and get the new value from useSession. it depends on the session state in order to know whether to open
    // the login modal if the user isn't logged in
    "authenticaticated"
  ]);
};

// use the memo() HOC to avoid re-rendering markers on the map so it's more effecient and doesn't cause every marker
// to flicker each time the map is dragged
export default memo(ListingMarker, propsAreEqual);
