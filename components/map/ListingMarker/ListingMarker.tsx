"use client";

import type { Listing } from "../../../types/listing_types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider";
import ListingMarkerContent from "@/components/map/ListingMarkerContent/ListingMarkerContent";
import {
  useGoogleMapsEventListener,
  useDomEventListener
} from "../../../providers/GoogleMapsProvider";

export type ListingMarkerProps = {
  listing: Listing;
  latitude: number;
  longitude: number;
  highlighted?: boolean;
  raisedZIndex?: number;
  onClick?: (listingSlug: string) => void;
  onMouseEnter?: (listingid: string) => void;
  onMouseLeave?: () => void;
};

const ListingMarker: React.FC<ListingMarkerProps> = ({
  listing,
  latitude,
  longitude,
  highlighted,
  raisedZIndex = 1000,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const { googleMap } = useGoogleMaps();
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [markerContainer, setMarkerContainer] = useState<HTMLDivElement | null>(
    null
  );

  // We use latitude/longitude separately from listing here because the
  // reference to a listing object is not stable, even if the latitude/longitude
  // are identical. Adding listing as a dependency to this useEffect causes the
  // markers to flicker when the map is moved because the marker will be
  // re-created when the reference to listing changes.
  useEffect(() => {
    if (!googleMap) return;

    const markerContainer = document.createElement("div");
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: {
        lat: latitude,
        lng: longitude
      },
      content: markerContainer
    });

    setMarker(marker);
    setMarkerContainer(markerContainer);

    return () => {
      marker.map = null;
      markerContainer.remove();
    };
  }, [googleMap, latitude, longitude]);

  useGoogleMapsEventListener(marker, "click", () => onClick?.(listing.slug));
  useDomEventListener(marker?.element, "mouseenter", () => {
    if (!marker) return;
    marker.element.style.zIndex = String(raisedZIndex);
    onMouseEnter?.(listing._id);
  });
  useDomEventListener(marker?.element, "mouseleave", () => {
    if (!marker) return;
    marker.element.style.zIndex = "";
    onMouseLeave?.();
  });

  if (!markerContainer) return;

  if (marker) {
    marker.element.style.zIndex = highlighted ? String(raisedZIndex) : "";
  }

  return createPortal(
    <ListingMarkerContent
      listing={listing}
      link={`/listing/${listing.slug}`}
      highlighted={highlighted}
    />,
    markerContainer
  );
};

export default ListingMarker;
