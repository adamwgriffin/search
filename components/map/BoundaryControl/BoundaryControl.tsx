import { useGoogleMaps } from "~/providers/GoogleMapsProvider";
import { useSearchState } from "~/providers/SearchStateProvider";
import type { SearchStateUpdate } from "~/zod_schemas/searchStateSchema";
import LoadingDots from "../../design_system/LoadingDots/LoadingDots";
import styles from "./BoundaryControl.module.css";

export type BoundaryControlProps = {
  loading: boolean;
};

const BoundaryControl: React.FC<BoundaryControlProps> = ({ loading }) => {
  const { googleMap } = useGoogleMaps();
  const { setSearchState } = useSearchState();

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
            setSearchState({
              bounds,
              address: null,
              place_id: null,
              address_types: null,
              boundary_id: null
            });
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
