import { useGoogleMaps } from "~/providers/GoogleMapsProvider";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import type { SearchParamsUpdate } from "~/zod_schemas/searchParamsSchema";
import LoadingDots from "../../design_system/LoadingDots/LoadingDots";
import styles from "./BoundaryControl.module.css";

export type BoundaryControlProps = {
  loading: boolean;
};

const BoundaryControl: React.FC<BoundaryControlProps> = ({ loading }) => {
  const { googleMap } = useGoogleMaps();
  const { updateSearchParams } = useSearchParamsState();

  return (
    <div className={styles.boundaryControl}>
      {!loading && (
        <button
          className={styles.boundaryControlButton}
          onClick={() => {
            if (!googleMap) return;
            const bounds = googleMap?.getBounds()?.toUrlValue();
            if (!bounds) throw new Error("No bounds present in map instance");
            // Setting params to null removes them from the request and indicates
            // to the fetchListings function that we should search by bounds
            // instead of location
            const updatedFilters: SearchParamsUpdate = {
              bounds,
              address: null,
              boundary_id: null
            };
            updateSearchParams(updatedFilters);
          }}
        >
          Remove Boundary
        </button>
      )}
      {loading && <LoadingDots size="var(--loading-dots-small)" />}
    </div>
  );
};

export default BoundaryControl;
