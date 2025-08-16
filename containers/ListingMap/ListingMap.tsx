"use client";

import BoundaryControl from "@/components/map/BoundaryControl/BoundaryControl";
import ZoomControl from "@/components/map/ZoomControl/ZoomControl";
import { useMapSearchState } from "@/hooks/useMapSearchState";
import { useSearchResultsData } from "@/hooks/useSearchResultsData";
import { getAvailableBoundsFromSearchResults } from "@/lib/boundary";
import { getNewSearchStateFromMap } from "@/lib/listingSearchParams";
import { useSearchState } from "@/providers/SearchStateProvider";
import { selectHighlightedMarker } from "@/store/application/applicationSlice";
import { useCallback, useEffect, useRef } from "react";
import GoogleMap from "../../components/map/GoogleMap/GoogleMap";
import ListingMarker from "../../components/map/ListingMarker/ListingMarker";
import MapBoundary from "../../components/map/MapBoundary/MapBoundary";
import {
  GoogleMapsMapOptions,
  MapBoundaryStyleOptions
} from "../../config/googleMapsOptions";
import { useAppSelector } from "../../hooks/app_hooks";
import { useOpenListingDetail } from "../../hooks/open_listing_detail_hook";
import { useGoogleMaps } from "../../providers/GoogleMapsProvider";
import styles from "./ListingMap.module.css";

const ListingMap: React.FC = () => {
  const updateFiltersOnMapIdle = useRef(false);
  const { googleLoaded, googleMap } = useGoogleMaps();
  const openListingDetail = useOpenListingDetail(true);
  const highlightedMarker = useAppSelector(selectHighlightedMarker);
  const { setSearchState } = useSearchState();
  const mapSearchState = useMapSearchState();
  const results = useSearchResultsData();

  const { isFetching } = results.queryResult;

  const handleListingMarkerMouseClick = useCallback(
    (listingSlug: string) => {
      openListingDetail(`/listing/${listingSlug}`, listingSlug);
    },
    [openListingDetail]
  );

  const handleIdle = useCallback(() => {
    if (!updateFiltersOnMapIdle.current) return;

    updateFiltersOnMapIdle.current = false;
    if (!googleMap) return;
    const newParams = getNewSearchStateFromMap(googleMap, results.boundaryId);
    setSearchState(newParams);
  }, [googleMap, results.boundaryId, setSearchState]);

  const handleZoomIn = useCallback(() => {
    if (!googleMap) return;

    const newParams = getNewSearchStateFromMap(googleMap, results.boundaryId);
    newParams.zoom =
      typeof newParams.zoom === "number" ? newParams.zoom + 1 : 1;
    setSearchState(newParams);
  }, [googleMap, results.boundaryId, setSearchState]);

  const handleZoomOut = useCallback(() => {
    if (!googleMap) return;

    const newParams = getNewSearchStateFromMap(googleMap, results.boundaryId);
    newParams.zoom =
      typeof newParams.zoom === "number" ? newParams.zoom - 1 : 1;
    setSearchState(newParams);
  }, [googleMap, results.boundaryId, setSearchState]);

  const handleUserAdjustedMap = useCallback(() => {
    updateFiltersOnMapIdle.current = true;
  }, []);

  // No bounds param in the url means it's a new search, so call fitBounds() to
  // adjust the map to fit the new boundary that was returned from the search
  // results
  useEffect(() => {
    if (!googleMap || mapSearchState.bounds) return;

    const feature = results.geoJSONBoundary?.id
      ? googleMap.data.getFeatureById(results.geoJSONBoundary.id)
      : undefined;
    const bounds = getAvailableBoundsFromSearchResults(
      feature,
      results.viewport
    );
    if (bounds) {
      googleMap.fitBounds(bounds);
    }
  }, [
    googleMap,
    results.geoJSONBoundary,
    mapSearchState.bounds,
    results.viewport
  ]);

  // Bounds param is present in the URL, which means we're searching an existing
  // location, so use the bounds & zoom from the url to adjust the map
  useEffect(() => {
    if (!googleMap) return;

    if (mapSearchState.bounds) {
      const center = new google.maps.LatLngBounds(
        mapSearchState.bounds
      ).getCenter();
      googleMap.setCenter(center);
      if (mapSearchState.zoom) {
        googleMap.setZoom(mapSearchState.zoom);
      }
    }
  }, [googleMap, mapSearchState.bounds, mapSearchState.zoom]);

  if (!googleLoaded) return <div className={styles.listingMap}></div>;

  return (
    <div className={styles.listingMap}>
      <GoogleMap
        options={GoogleMapsMapOptions}
        onIdle={handleIdle}
        onDragEnd={handleUserAdjustedMap}
        onWheel={handleUserAdjustedMap}
      >
        {results.listings.map((l) => (
          <ListingMarker
            key={l._id}
            listing={l}
            latitude={l.latitude}
            longitude={l.longitude}
            highlighted={highlightedMarker === l._id}
            onClick={handleListingMarkerMouseClick}
          />
        ))}
        <MapBoundary
          boundary={results.geoJSONBoundary}
          {...MapBoundaryStyleOptions}
        />
        {mapSearchState.showRemoveBoundaryButton && (
          <BoundaryControl loading={isFetching} />
        )}
        <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </GoogleMap>
    </div>
  );
};

export default ListingMap;
