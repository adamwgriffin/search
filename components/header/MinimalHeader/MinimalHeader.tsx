import Logo from "../Logo/Logo";
import UserMenu from "../../../containers/UserMenu/UserMenu";
import styles from "./MinimalHeader.module.css";

const MinimalHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <UserMenu />
    </header>
  );
};

export default MinimalHeader;
