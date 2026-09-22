import styles from "./SearchHeader.module.css";
import Logo from "../../components/header/Logo/Logo";
import Filters from "../Filters/Filters";
import UserMenu from "../UserMenu/UserMenu";
import HideSmallAndDown from "../../components/HideSmallAndDown/HideSmallAndDown";
import SearchLocation from "@/components/form/SearchLocation";
import { Suspense } from "react";
import SearchLocationFallback from "@/components/form/SearchLocationFallback";

// We're using <Suspense> because some components require
// useSearchParams(). See
// https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
const SearchHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <HideSmallAndDown>
        <Logo />
      </HideSmallAndDown>
      <Suspense fallback={<SearchLocationFallback />}>
        <SearchLocation />
      </Suspense>
      <div className={styles.controls}>
        <UserMenu />
      </div>
      <div className={styles.filters}>
        <Filters />
      </div>
    </header>
  );
};

export default SearchHeader;
