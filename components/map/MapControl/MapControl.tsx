import type { NextPage } from "next";
import styles from "./MapControl.module.css";
import BoundaryControl from "../BoundaryControl/BoundaryControl";
import LoadingDots from "../../design_system/LoadingDots/LoadingDots";

export interface MapControlProps {
  boundaryActive: boolean;
  listingSearchRunning: boolean;
  onBoundaryControlClick: () => void;
}

const MapControl: NextPage<MapControlProps> = ({
  boundaryActive,
  listingSearchRunning,
  onBoundaryControlClick
}) => {
  if (listingSearchRunning || boundaryActive) {
    return (
      <div className={styles.mapControl}>
        {!listingSearchRunning && boundaryActive && (
          <BoundaryControl onClick={onBoundaryControlClick} />
        )}
        {listingSearchRunning && (
          <LoadingDots size="var(--loading-dots-small)" />
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default MapControl;
