"use client";

import type { Listing } from "@/types/listing_types";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import ListingMarkerContent from "@/components/map/ListingMarkerContent/ListingMarkerContent";

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
  // The container is the only thing needed during render (as the portal
  // target), so it's created once here. ListingMap only renders markers after
  // the Google Maps API has loaded, so this never runs on the server.
  const [markerContainer] = useState(() => document.createElement("div"));
  // The marker itself is only used in effects and event handlers, so it can
  // live in a ref instead of state.
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const setZIndex = (
    marker: google.maps.marker.AdvancedMarkerElement,
    raised: boolean
  ) => {
    marker.element.style.zIndex = raised ? String(raisedZIndex) : "";
  };

  // Effect events always see the latest props, so the marker doesn't need to
  // be re-created when the handlers or highlighted state change
  const handleClick = useEffectEvent(() => onClick?.(listing.slug));
  const handleMouseEnter = useEffectEvent(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      setZIndex(marker, true);
      onMouseEnter?.(listing._id);
    }
  );
  const handleMouseLeave = useEffectEvent(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      setZIndex(marker, false);
      onMouseLeave?.();
    }
  );
  const applyHighlight = useEffectEvent(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      setZIndex(marker, !!highlighted);
    }
  );

  // We use latitude/longitude separately from listing here because the
  // reference to a listing object is not stable, even if the latitude/longitude
  // are identical. Adding listing as a dependency to this useEffect causes the
  // markers to flicker when the map is moved because the marker will be
  // re-created when the reference to listing changes.
  useEffect(() => {
    if (!googleMap) return;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: googleMap,
      position: {
        lat: latitude,
        lng: longitude
      },
      content: markerContainer
    });
    markerRef.current = marker;
    applyHighlight(marker);

    const clickListener = google.maps.event.addListener(
      marker,
      "click",
      handleClick
    );
    const onEnter = () => handleMouseEnter(marker);
    const onLeave = () => handleMouseLeave(marker);
    marker.element.addEventListener("mouseenter", onEnter);
    marker.element.addEventListener("mouseleave", onLeave);

    return () => {
      clickListener.remove();
      marker.element.removeEventListener("mouseenter", onEnter);
      marker.element.removeEventListener("mouseleave", onLeave);
      marker.map = null;
      markerRef.current = null;
    };
  }, [googleMap, latitude, longitude, markerContainer]);

  useEffect(() => {
    if (markerRef.current) applyHighlight(markerRef.current);
  }, [highlighted]);

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
