import FiltersFallback from "@/components/form/FiltersFallback";
import FiltersButtonContainer from "@/containers/FiltersButtonContainer/FiltersButtonContainer";
import SaveSearchButtonContainer from "@/containers/SaveSearchButtonContainer/SaveSearchButtonContainer";
import { Suspense } from "react";
import BedsAndBathsMenuButton from "../../components/form/BedsAndBathsMenuButton/BedsAndBathsMenuButton";
import MobileViewSwitcher from "../../components/form/MobileViewSwitcher/MobileViewSwitcher";
import MoreMenuButton from "../../components/form/MoreMenuButton/MoreMenuButton";
import PriceMenuButton from "../../components/form/PriceMenuButton/PriceMenuButton";
import styles from "./Filters.module.css";

const Filters: React.FC = () => {
  return (
    <div className={styles.filters}>
      <Suspense fallback={<FiltersFallback />}>
        <PriceMenuButton />
        <BedsAndBathsMenuButton />
        <MoreMenuButton />
        <FiltersButtonContainer />
        <SaveSearchButtonContainer />
        <MobileViewSwitcher />
      </Suspense>
    </div>
  );
};

export default Filters;
