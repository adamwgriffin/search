import styles from "./ListingDetailHeader.module.css";
import Logo from "../../components/header/Logo/Logo";
import SearchLocation from "@/components/form/SearchLocation";
import UserMenu from "../UserMenu/UserMenu";
import HideSmallAndDown from "../../components/HideSmallAndDown/HideSmallAndDown";

const ListingDetailHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <HideSmallAndDown>
        <Logo />
      </HideSmallAndDown>
      <SearchLocation />
      <UserMenu />
    </header>
  );
};

export default ListingDetailHeader;
