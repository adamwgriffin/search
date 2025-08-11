import styles from "./SearchHeader.module.css";
import Logo from "../../components/header/Logo/Logo";
import Filters from "../Filters/Filters";
import UserMenu from "../UserMenu/UserMenu";
import HideSmallAndDown from "../../components/HideSmallAndDown/HideSmallAndDown";
import SearchLocation from "~/components/form/SearchLocation";

const SearchHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <HideSmallAndDown>
        <Logo />
      </HideSmallAndDown>
      <SearchLocation />
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
