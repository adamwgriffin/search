import type { NextPage } from "next";
import styles from "./ListingDetailHeader.module.css";
import Logo from "../../components/header/Logo/Logo";
import StandaloneSearchField from "../StandaloneSearchField/StandaloneSearchField";
import UserMenu from "../UserMenu/UserMenu";
import HideSmallAndDown from "../../components/HideSmallAndDown/HideSmallAndDown";

const ListingDetailHeader: NextPage = () => {
  return (
    <header className={styles.header}>
      <HideSmallAndDown>
        <Logo />
      </HideSmallAndDown>
      <StandaloneSearchField />
      <UserMenu />
    </header>
  );
};

export default ListingDetailHeader;
