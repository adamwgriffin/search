"use client";

import {
  selectMobileViewType,
  toggleMobileViewType,
  useApplicationStore
} from "@/store/applicationStore";
import ListIcon from "@/components/design_system/icons/ListIcon/ListIcon";
import MapIcon from "@/components/design_system/icons/MapIcon/MapIcon";
import styles from "./MobileViewSwitcher.module.css";

const ViewSwitcher: React.FC = () => {
  const mobileViewType = useApplicationStore(selectMobileViewType);

  return (
    <button
      className={styles.viewSwitcher}
      onClick={() => {
        toggleMobileViewType(mobileViewType === "list" ? "map" : "list");
      }}
    >
      {mobileViewType === "list" ? (
        <>
          <MapIcon /> Map
        </>
      ) : (
        <>
          <ListIcon /> List
        </>
      )}
    </button>
  );
};

export default ViewSwitcher;
