"use client";

import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { useMedia } from "react-use";
import BoundaryControl from "~/components/map/BoundaryControl/BoundaryControl";
import ZoomControl from "~/components/map/ZoomControl/ZoomControl";
import { useMapSearchState } from "~/hooks/useMapSearchState";
import { useSearchResultsData } from "~/hooks/useSearchResultsData";
import { getAvailableBoundsFromSearchResults } from "~/lib/boundary";
import { getNewSearchStateFromMap } from "~/lib/listingSearchParams";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import { setSelectedListing } from "~/store/listingSearch/listingSearchSlice";
import GoogleMap from "../../components/map/GoogleMap/GoogleMap";
import ListingMarker from "../../components/map/ListingMarker/ListingMarker";
import MapBoundary from "../../components/map/MapBoundary/MapBoundary";
import {
  GoogleMapsMapOptions,
  MapBoundaryStyleOptions
} from "../../config/googleMapsOptions";
import { useAppDispatch, useAppSelector } from "../../hooks/app_hooks";
import { useOpenListingDetail } from "../../hooks/open_listing_detail_hook";
import { useGoogleMaps } from "../../providers/GoogleMapsProvider";
import { selectHighlightedMarker } from "../../store/listingSearch/listingSearchSelectors";
import styles from "./ListingMap.module.css";

const ListingMap: NextPage = () => {
  const dispatch = useAppDispatch();
  const updateFiltersOnMapIdle = useRef(false);
  const { googleLoaded, googleMap } = useGoogleMaps();
  const { status } = useSession();
  const openListingDetail = useOpenListingDetail(true);
  const isSmallAndUp = useMedia("(min-width: 576px)", false);
  const highlightedMarker = useAppSelector(selectHighlightedMarker);
  const { updateSearchParams } = useSearchParamsState();
  const mapSearchState = useMapSearchState();
  const results = useSearchResultsData();

  const { isFetching } = results.queryResult;

  const handleListingMarkerMouseEnter = useCallback(
    (listingid: string) => {
      isSmallAndUp && dispatch(setSelectedListing(listingid));
    },
    [dispatch, isSmallAndUp]
  );

  const handleListingMarkerMouseLeave = useCallback(() => {
    isSmallAndUp && dispatch(setSelectedListing(null));
  }, [dispatch, isSmallAndUp]);

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
    updateSearchParams(newParams);
  }, [googleMap, results.boundaryId, updateSearchParams]);

  const handleZoomIn = useCallback(() => {
    if (!googleMap) return;
    const newParams = getNewSearchStateFromMap(googleMap, results.boundaryId);
    newParams.zoom =
      typeof newParams.zoom === "number" ? newParams.zoom + 1 : 1;
    updateSearchParams(newParams);
  }, [googleMap, results.boundaryId, updateSearchParams]);

  const handleZoomOut = useCallback(() => {
    if (!googleMap) return;
    const newParams = getNewSearchStateFromMap(googleMap, results.boundaryId);
    newParams.zoom =
      typeof newParams.zoom === "number" ? newParams.zoom - 1 : 1;
    updateSearchParams(newParams);
  }, [googleMap, results.boundaryId, updateSearchParams]);

  const handleUserAdjustedMap = useCallback(() => {
    updateFiltersOnMapIdle.current = true;
  }, []);

  // No bounds param in the url means it's a new search, so call fitBounds()
  // to adjust the map to fit the new boundary that was returned from the
  // search results
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
        {results.listings.map((l, i) => (
          <ListingMarker
            key={l._id.toString()}
            authenticaticated={status === "authenticated"}
            listing={l}
            highlighted={highlightedMarker === l._id}
            zIndex={i}
            onMouseEnter={handleListingMarkerMouseEnter}
            onMouseLeave={handleListingMarkerMouseLeave}
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
