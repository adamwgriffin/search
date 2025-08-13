import { convertURLBoundsParamToLatLngBoundsLiteral } from "~/lib/boundary";
import { useSearchState } from "~/providers/SearchStateProvider";

/**
 * A hook that handles computing state derived from the search state params
 */
export function useMapSearchState() {
  const { searchState } = useSearchState();

  const bounds = searchState.bounds
    ? convertURLBoundsParamToLatLngBoundsLiteral(searchState.bounds)
    : null;

  const zoom = searchState.zoom ?? null;

  const showRemoveBoundaryButton = Boolean(
    searchState.address || searchState.boundary_id
  );

  return { bounds, zoom, showRemoveBoundaryButton };
}
