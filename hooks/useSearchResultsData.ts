import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchState } from "~/providers/SearchStateProvider";
import { useMemo } from "react";
import { sortListingsByLatLng } from "~/lib/listing_helpers";
import { searchQueryOptions } from "~/lib/queries";
import type { GeoJSONBoundary } from "~/types";
import { convertBoundaryToGeoJSON } from "~/lib/boundary";

/**
 * A hook that handles computing derived data from the search results.
 */
export function useSearchResultsData() {
  const { searchState } = useSearchState();
  // Using keepPreviousData with placeholderData keeps the data from the last
  // request so that we can still show the current data while new data is being
  // fetched. We're doing this so that the map markers won't blink from being
  // re-rendered each time the map is moved and a new data fetch happens. See
  // details:
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
  const queryResult = useQuery({
    ...searchQueryOptions(searchState),
    placeholderData: keepPreviousData
  });

  const results = queryResult.data;

  // If the user changes the sort criteria, it will cause the markers to
  // re-render on the map, even if the have the exact same listing data, which
  // is yet another thing that makes the markers blink. It seems that
  // overlapping markers are placed with a different zIndex depending on what
  // order they were rendered in. Keeping the order stable by making sure they
  // always sort the same way fixes this.
  const listings = useMemo(() => {
    return results?.listings ? sortListingsByLatLng(results.listings) : [];
  }, [results?.listings]);

  const geoJSONBoundary: GeoJSONBoundary | null = results?.boundary
    ? convertBoundaryToGeoJSON(results.boundary)
    : null;

  return {
    queryResult,
    boundaryId: results?.boundary?._id,
    listings,
    geoJSONBoundary,
    viewport: results?.viewport
  };
}
