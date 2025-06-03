import type { NextPage } from "next";
import styles from "./HomePageHeader.module.css";
import Logo from "../Logo/Logo";
import UserMenu from "../../../containers/UserMenu/UserMenu";

const HomePageHeader: NextPage = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <UserMenu />
    </header>
  );
};

export default HomePageHeader;
